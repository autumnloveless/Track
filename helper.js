const plaid = require("plaid");
const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.development,
    options: { version: "2020-09-14" },
  });
const Item = require("./database/controllers/plaidItem");

// Update the webhook associated with an Item
exports.updatePlaidWebhook = async () => {
    const newUrl = "https://lumin-transactions-test.herokuapp.com/api/plaid/webhook";
    const itemId = "q6Rwrn94R7u0dx497znMf3oNoz5LyJUJoZnbO";

    let { item, success, error } = await Item.findByItemId(itemId).catch(e => console.error(e));
    if(error || !success) { console.error(error); return; } 

    result = await client
    .updateItemWebhook(item.accessToken, newUrl)
    .catch((err) => {
        console.error(err);
    });
    // A successful response indicates that the webhook has been
    // updated. An acknowledgement webhook will also be fired.
    console.log("Result:", result);

}