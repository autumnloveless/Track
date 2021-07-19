const plaid = require("plaid");
const Item = require("../database/controllers/plaidItem");
const Account = require("../database/controllers/plaidAccount");
const Transaction = require("../database/controllers/plaidTransaction");
const { Op } = require("sequelize");
const moment = require("moment");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.development,
  options: { version: "2020-09-14" },
});
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
exports.getLinkToken = async (request, response) => {
  const configs = {
    user: { client_user_id: request.user.id },
    client_name: "Track App",
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: "en",
    webhook: process.env.API_URL + "/api/plaid/webhook"
  };

  if (PLAID_REDIRECT_URI !== "") {
    configs.redirect_uri = PLAID_REDIRECT_URI;
  }
  const createTokenResponse = await client.createLinkToken(configs);
  return response.status(200).json(createTokenResponse);
};

// Exchange token flow - exchange a Link public_token for an API access_token
// https://plaid.com/docs/#exchange-token-flow
exports.setAccessToken = async (request, response, next) => {
  const tokenResponse = await client.exchangePublicToken(request.body.public_token);
  result = await Item.create({
    userId: request.user.id,
    accessToken: tokenResponse.access_token,
    itemId: tokenResponse.item_id,
  });

  return response.json({
    success: result.success,
    access_token: result.item.accessToken,
    item_id: result.item.itemId,
    error: result.error,
  });
};

const fetchTransactions = async (plaidItemId, startDate, endDate) => {
  // the transactions endpoint is paginated, so we may need to hit it multiple times to
  // retrieve all available transactions.
  try {
    // get the access token based on the plaid item id
    const { item } = await Item.findByItemId(plaidItemId);
    const accessToken = item.accessToken;

    const response = await client
      .getTransactions(accessToken, startDate, endDate, {})
      .catch((err) => {
        console.log(err)
      });
    let transactions = response.transactions;
    let accounts = response.accounts;
    const total_transactions = response.total_transactions;
    // Manipulate the offset parameter to paginate
    // transactions and retrieve all available data
    while (transactions.length < total_transactions) {
      const paginatedTransactionsResponse = await client.getTransactions(
        accessToken,
        startDate,
        endDate,
        { offset: transactions.length }
      );
      transactions = transactions.concat(
        paginatedTransactionsResponse.transactions
      );
    }
    return { transactions: transactions, accounts: accounts };
  } catch (err) {
    console.error(`Error fetching transactions: ${err.message}`);
    return { transactions: [], accounts: [] };
  }
};

const handleTransactionsUpdate = async (userId, plaidItemId, startDate, endDate, read = false) => {
  // Fetch new transactions from plaid api.
  let { transactions: incomingTransactions, accounts: incomingAccounts } =
    await fetchTransactions(plaidItemId, startDate, endDate);

  // Retrieve existing transactions from our db.
  const { transactions: existingTransactions } = await Transaction.list({
    [Op.and]: {
      date: {
        [Op.between]: [startDate, endDate]
      },
      itemId: plaidItemId,
    },
  });

  // Compare to find new transactions.
  const existingTransactionIds = existingTransactions.reduce(
    (idMap, transaction) => ({
      ...idMap,
      [transaction.transactionId]: transaction.transactionId,
    }),
    {}
  );
  let transactionsToStore = incomingTransactions.filter(
    ({ transaction_id: transactionId }) => {
      const isExisting = existingTransactionIds[transactionId];
      return !isExisting;
    }
  );

  // Compare to find removed transactions (pending transactions that have posted or cancelled).

  const incomingTransactionIds = incomingTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
      ...idMap,
      [transactionId]: transactionId,
    }),
    {}
  );

  const transactionsToRemove = existingTransactions
  .filter((transaction) => {
      const isIncoming = incomingTransactionIds[transaction.transactionId];
      return !isIncoming;
    })
  .map((transaction) => transaction.transactionId);

  transactionsToStore = transactionsToStore.map((transaction) => ({
    userId: userId,
    transactionId: transaction.transaction_id,
    itemId: plaidItemId,
    accountId: transaction.account_id,
    amount: transaction.amount,
    read: read,
    starred: false,
    isoCurrencyCode: transaction.iso_currency_code,
    unofficialCurrencyCode: transaction.unofficial_currency_code,
    category: transaction.category,
    categoryId: transaction.category_id,
    date: transaction.date,
    authorizedDate: transaction.authorized_date,
    locationId: transaction.location_id,
    name: transaction.name,
    merchantName: transaction.merchant_name,
    paymentChannel: transaction.payment_channel,
    pending: transaction.pending,
    pendingTransactionId: transaction.pending_transaction_id,
    accountOwner: transaction.account_owner,
    transactionCode: transaction.transaction_code,
    transactionType: transaction.transaction_type,
  }));

  let { accounts:existingAccounts } = await Account.list({ userId: userId });
  // Compare to find new transactions.
  const existingAccountIds = existingAccounts.reduce(
    (idMap, account) => ({
      ...idMap,
      [account.accountId]: account.accountId,
    }),
    {}
  );
  let accountsToStore = incomingAccounts.filter(
    ({ account_id: accountId }) => {
      const isExisting = existingAccountIds[accountId];
      return !isExisting;
    }
  );

  accountsToStore = accountsToStore.map(account => ({
    userId: userId,
    accountId: account.account_id,
    itemId: plaidItemId,
    balanceAvailable: account.balances.available,
    balanceCurrent: account.balances.current,
    balanceLimit: account.balances.limit,
    isoCurrencyCode: account.balances.iso_currency_code,
    unofficialCurrencyCode: account.balances.unofficial_currency_code,
    lastUpdatedDateTime: account.balances.last_updated_datetime,
    mask: account.mask,
    name: account.name,
    officialName: account.official_name,
    type: account.type,
    subtype: account.subtype,
    verificationStatus: account.verification_status,
  }));

  await Account.bulkCreate(accountsToStore);
  await Transaction.bulkCreate(transactionsToStore);
  await Transaction.bulkDelete(transactionsToRemove);
  return;
};

exports.handleTransactionsWebhook = async (req, res) => {
  const {
    webhook_code: webhookCode,
    item_id: plaidItemId,
    new_transactions: newTransactions,
    removed_transactions: removedTransactions,
  } = req.body;

  switch (webhookCode) {
    case "INITIAL_UPDATE": {
      // Fired when an Item's initial transaction pull is completed.
      // Note: The default pull is 30 days.
      const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate, true);
      break;
    }
    case "HISTORICAL_UPDATE": {
      // Fired when an Item's historical transaction pull is completed. Plaid fetches as much
      // data as is available from the financial institution.
      const startDate = moment().subtract(6, "months").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate, true);
      break;
    }
    case "DEFAULT_UPDATE": {
      // Fired when new transaction data is available as Plaid performs its regular updates of
      // the Item. Since transactions may take several days to post, we'll fetch 14 days worth of
      // transactions from Plaid and reconcile them with the transactions we already have stored.
      const startDate = moment().subtract(14, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate);
      break;
    }
    case "TRANSACTIONS_REMOVED": {
      await Transaction.bulkDelete(removedTransactions);
      break;
    }
    default:
      console.log("unhandled webhook type received.");
  }
};

exports.updateTransactions = async (req, res) => {
  const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  const { items } = await Item.get({ userId: req.user.id });
  await items.forEach(async (item) => {
    await handleTransactionsUpdate(req.user.id, item.itemId, startDate, endDate)
  });
  
  res.status(200).json({"success": true})
}