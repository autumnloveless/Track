const twilioNumber = process.env.TWILIONUMBER;
const twilioClient = require('twilio')(process.env.TWILIOACCOUNTSID, process.env.TWILIOAUTHTOKEN);
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
});

const handleSMS = async (from,message) =>
{
    rollbar.log("New SMS Message", from, message);
}

const sendMessage = async (phone_number,message) =>
{
    await twilioClient.messages
    .create({
        body: message,
        from: twilioNumber,
        to: phone_number
    })
    return ""
}

module.exports = { handleSMS, sendMessage }