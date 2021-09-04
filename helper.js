const plaid = require("plaid");
const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.development,
    options: { version: "2020-09-14" },
  });
const Item = require("./database/controllers/plaidItem");
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
});

// Update the webhook associated with an Item
exports.updatePlaidWebhook = async () => {
    // TODO - use environment variable here ?
    const newUrl = "https://lumin-transactions-test.herokuapp.com/api/plaid/webhook";
    const itemId = "q6Rwrn94R7u0dx497znMf3oNoz5LyJUJoZnbO";

    let { item, success, error } = await Item.findByItemId(itemId).catch(e => rollbar.error("error finding item with id", e, itemId));
    if(error || !success) { rollbar.error("error finding item with id", error, itemId); return; } 

    result = await client
    .updateItemWebhook(item.accessToken, newUrl)
    .catch((err) => {
        rollbar.error("Error updating item webhook", err, item);
    });
    // A successful response indicates that the webhook has been
    // updated. An acknowledgement webhook will also be fired.
    rollbar.log("Updated item webhook", result);
}