require('dotenv').config();

const twilioNumber = process.env.twilioNumber;
const twilioClient = require('twilio')(process.env.twilioAccountSid, process.env.twilioAuthToken);
// clean up input and send it right direction
const handleSMS = async (from,message) =>
{
    let response, command, messageBody;

    console.log("")
    console.log("-------------------New Message------------------")
    console.log("From", from);
    console.log("Message", message);
    console.log("================================================")
    console.log("")


    return response;
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

module.exports = {
  handleSMS
}