const plaid = require("plaid");
const Item = require("../database/controllers/plaidItem");
const Account = require("../database/controllers/plaidAccount");
const Transaction = require("../database/controllers/plaidTransaction");
const { Op } = require("sequelize");
const moment = require("moment");
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
});

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
  const createTokenResponse = await client.createLinkToken(configs).catch(e => rollbar.error("Error creating link token", e));
  return response.status(createTokenResponse ? 200 : 400).json(createTokenResponse ? createTokenResponse : {error: "Error creating link token"});
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

    const response = await client.getTransactions(accessToken, startDate, endDate, {})
    .catch((err) => {
      rollbar.error("Error getting transactions", err)
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
    rollbar.error("Error fetching plaid transactions", err);
    return { transactions: [], accounts: [] };
  }
};

const handleTransactionsUpdate = async (userId, plaidItemId, startDate, endDate, read = false) => {
  // Fetch new transactions from plaid api.
  let { transactions: incomingTransactions, accounts: incomingAccounts } =
    await fetchTransactions(plaidItemId, startDate, endDate).catch(e => {
      rollbar.error("Error getting transactions from plaid!", e);
      return;
    });

  // Retrieve existing transactions from our db.
  const { transactions: existingTransactions } = await Transaction.list({
    [Op.and]: {
      date: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      },
      itemId: plaidItemId,
    },
  }).catch(e => {
    rollbar.error("Error getting transactions from database!", e);
    return;
  });

  // Compare to find new transactions.
  const existingTransactionIds = existingTransactions.reduce((idMap, transaction) => ({
    ...idMap,
    [transaction.transactionId]: transaction.transactionId,
  }), {});
  
  let transactionsToStore = incomingTransactions.filter(({ transaction_id: transactionId }) => {
    const isExisting = existingTransactionIds[transactionId];
    return !isExisting;
  });

  // Compare to find removed transactions (pending transactions that have posted or cancelled).
  const incomingTransactionIds = incomingTransactions.reduce((idMap, { transaction_id: transactionId }) => ({
    ...idMap,
    [transactionId]: transactionId,
  }), {});

  const transactionsToRemove = existingTransactions.filter((transaction) => {
    const isIncoming = incomingTransactionIds[transaction.transactionId];
    return !isIncoming;
  }).map((transaction) => transaction.transactionId);

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
  // Compare to find new accounts.
  const existingAccountMap = existingAccounts.reduce((idMap, account) => ({
      ...idMap,
      [account.accountId]: account,
    }),
    {}
  );
  let accountsToStore = incomingAccounts.map((account) => {
    const existingAccount = existingAccountMap[account.account_id];
    if(existingAccount?.id) { 
      account.id = existingAccount.id; 
    }
    return account;
  });

  accountsToStore = accountsToStore.map(account => ({
    id: account.id,
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

  await Account.bulkCreate(accountsToStore).catch(e => {
    rollbar.error("Error bulk creating accounts!", e);
    return
  });
  if(transactionsToStore.length > 0){
    await Transaction.bulkCreate(transactionsToStore).catch(e => {
      rollbar.error("Error bulk creating transactions!", e);
      return
    });
  }
  if(transactionsToRemove.length > 0){
    await Transaction.bulkDelete(transactionsToRemove).catch(e => {
      rollbar.error("Error deleting transactions!", e);
      return
    });
  }
  return;
};

exports.handleTransactionsWebhook = async (req, res) => {
  rollbar.log("Handling Transactions Webhook");
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
      rollbar.log("Performing initial update");
      const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate, true).catch(e => {
        rollbar.error("Error handling transactions update", e);
        return res.sendStatus(500);
      });
      break;
    }
    case "HISTORICAL_UPDATE": {
      // Fired when an Item's historical transaction pull is completed. Plaid fetches as much
      // data as is available from the financial institution.
      rollbar.log("Performing historical update");
      const startDate = moment().subtract(6, "months").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate, true).catch(e => {
        rollbar.error("Error handling transactions historical update", e);
        return res.sendStatus(500);
      });
      break;
    }
    case "DEFAULT_UPDATE": {
      // Fired when new transaction data is available as Plaid performs its regular updates of
      // the Item. Since transactions may take several days to post, we'll fetch 14 days worth of
      // transactions from Plaid and reconcile them with the transactions we already have stored.
      rollbar.log("Performing default update");
      const startDate = moment().subtract(14, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
      await handleTransactionsUpdate(req.user.id, plaidItemId, startDate, endDate).catch(e => {
        rollbar.error("Error handling transactions default update", e);
        return res.sendStatus(500);
      });
      break;
    }
    case "TRANSACTIONS_REMOVED": {
      rollbar.log("Performing transactions removed");
      await Transaction.bulkDelete(removedTransactions).catch(e => {
        rollbar.error("Error deleting transactions", e);
        return res.sendStatus(500);
      });
      break;
    }
    default:
      rollbar.error("unhandled webhook type received: " + webhookCode, webhookCode);
  }
  rollbar.log("Update successful!");
  return res.sendStatus(200);
};

exports.updateTransactions = async (req, res) => {
  const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  const { items } = await Item.get({ userId: req.user.id });
  await Promise.all(items.map(async (item) => {
    await handleTransactionsUpdate(req.user.id, item.itemId, startDate, endDate)
  }));
  
  res.status(200).json({"success": true})
}