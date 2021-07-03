const plaid = require('plaid');
const Item = require("../database/controllers/plaidItem");
const Account = require("../database/controllers/plaidAccount");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox,
  options: { version: '2020-09-14' }
});
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
exports.getLinkToken = async (request, response) => {
  const configs = {
    user: { client_user_id: request.user.id },
    client_name: "Track App",
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: "en",
  };

  if (PLAID_REDIRECT_URI !== "") { configs.redirect_uri = PLAID_REDIRECT_URI; }
  const createTokenResponse = await client.linkTokenCreate(configs);
  response.json(createTokenResponse.data);
}

// Exchange token flow - exchange a Link public_token for an API access_token
// https://plaid.com/docs/#exchange-token-flow
exports.setAccessToken = async (request, response, next) => {
  PUBLIC_TOKEN = request.body.public_token;
  const tokenResponse = await client.itemPublicTokenExchange({ public_token: PUBLIC_TOKEN });
  result = await Item.create({ 
    userId: request.user.id,
    accessToken: tokenResponse.data.access_token,
    itemId: tokenResponse.data.item_id
  });

  return response.json({
    success: result.success,
    access_token: result.item.accessToken,
    item_id: result.item.itemId,
    error: result.error,
  });
}

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
exports.generateAccounts = async (request, response, next) => {
  const accessToken = await Item.find(request.body.item_id).accessToken;

  client.getAccounts(accessToken, (error, accountsResponse) => {
    if (error) { return response.json({ success: false, error: error }); }
    const account = accountsResponse.account;

    results = [];
    for(account of accountsResponse.accounts){
      result = await Account.upsert({
        userId: request.user.id,
        accountId: account.account_id,
        itemId: request.body.item_id,
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
      });
      results.push(result);
    }
    
    response.json({ success: true, results: results, accounts: accountsResponse });
  });
}

