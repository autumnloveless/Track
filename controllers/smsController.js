require('dotenv').config();

const userController = require('../controllers/userController');
const queueController = require('../controllers/queueController');

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

    message = message.trim();
    if(message[0] != '!') 
    {
        command = "message";
        messageBody = message;
    }
    else{
        const index = message.indexOf(' ');
        if(index == -1)
        {
            [command, messageBody] = [message.slice(1), ""];
        }
        else
        {
            [command, messageBody] = [message.slice(1, index), message.slice(index + 1)];
        }        
    }

    response = await routeSMS(from, command.toLowerCase(), messageBody)
    .catch((error) => {
        console.log(error)
        return "Error Occured"
    })

    return response;
}

// decide what to do with commands and input
const routeSMS = async (from,command,message) =>
{
  let response, user;
  
  switch(command)
  {
    case "message":
      response = handleMessage(from,message);
      break;
    case "stop":
    case "unpair":
      response = unpair(from);
      break;
    case "signup":
      response = signup(from,message);
      break;
    case "rename":
      response = rename(from,message);
      break;
    case "pair":
      response = pair(from);
      break;
    case "help":
      response = `Welcome to CoronaChat! Here is the current list of commands I can respond to:
      !stop
      !unpair
      !rename [new name]
      !signup [name]
      !pair
      !help
      !deleteme
      `
      break;
    case "deleteme": 
      response = deleteData(from);
      break;
    default:
      response = 
      `Welcome to CoronaChat! I am not certain what you asked me? Here is the current list of commands I can respond to:
      !stop
      !unpair
      !rename [new name]
      !signup [name]
      !pair
      !help
      !deleteme
      `
      break;
  }

  return response;
}

const pair = async (from) => {
    let response;
    let user = await userController.getUserById(from);
    const ten_minutes = 1000 * 60 * 10;

    if(user == null || user == undefined)
    {
        response = "Hi! I don't seem to know you. Text me !signup [your name] to sign up!"
    }
    else if((user.pair_number != null || user.pair_number != undefined) 
    && ((new Date) - user.pair_date_utc) < ten_minutes)
    {
        response = "You are already paired up! You can !unpair or you can queue up in " + (10 - (((new Date) - user.pair_date_utc) / (1000 * 60))).toFixed(0) + " minutes"
    }
    else{
        const queuedUser = await queueController.getQueueItemByNumber(from);
        if(queuedUser == null || queuedUser == undefined )
        {
            const queue = await queueController.checkQueue(from);
            if(queue.length == 0){
                await queueController.queueUser(from);
                response = "You have been placed in the queue! We will let you know when you are matched!"
            }
            else{
                try{
                    await queueController.setStatus(queue[0].requester_number,{status:'pending'});
                    await userController.pair(from,queue[0].requester_number);
                    await queueController.removeFromQueue(queue[0].requester_number)
                    await sendMessage(queue[0].requester_number,"You have been paired! Start texting your partner now!")
                    response = "You have been paired! Start texting your partner now!"
                }
                catch(err) {
                    await queueController.setStatus(queue[0].requester_number,{status:'new'});
                    throw err;
                }
            }  
        }
        else {
            response = "You are already in the queue! We will let you know when you are matched!"
        }
    }
    
    return response;
}

const handleMessage = async (from,message) =>
{
    const ten_minutes = 1000 * 60 * 10;
    let response;
    let user = await userController.getUserById(from);
    if(user != null && user!= undefined)
    {
        let linkedUser = await user.getPair();
        if(linkedUser!=null && linkedUser !=undefined)
        {
            if(("Time: ",(new Date) - user.pair_date_utc) <= ten_minutes)
            {
                response = await forwardMessage(user,linkedUser,message);
            }
            else{
                await unpair(from);
                response = "Your 10 minutes is up! You can text !pair to rejoin the queue and meet someone else!"
            }
        }
        else{
            response = "Hi! You don't appear to have a parter. Text me !pair to find one now! Text !help for more information!"
        }
    }
    else{
            response = "Hi! I don't seem to know you. Text me !signup [your name] to sign up! Text !help for more information!"
    }
    return response;
}

const rename = async (from,message) =>
{
    const newData = {name:message};
    const updatedUser = await userController.updateUser(newData,from)
    return "All done! Let me be the first to say welcome, " + updatedUser.name
}

const unpair = async (phoneNumber) =>
{
    let response = "Unpaired! Type !pair to rejoin!";
    const queueItem = queueController.getQueueItemByNumber(phoneNumber);
    if(queueItem != null && queueItem != undefined)
    {
        await queueController.removeFromQueue(phoneNumber)
        response = "Removed from queue! Type !pair to rejoin!"
    }

    const user = await userController.getUserById(phoneNumber);
    if(user.pair_number != null && user.pair_number != undefined)
    {
        const updatedUser = await userController.unpair(phoneNumber)
        response = "Ended chat session! Type !pair to start a new one!"
    }
    
    return response
}

const signup = async (phoneNumber,messageBody) =>
{
    let user = await userController.getUserById(phoneNumber);
    let response;
    if(user != null && user!= undefined)
    {
        response = "Welcome back! It seems I already know you. How can be of help?"
    }
    else
    {
        const newUser = await userController.createUser(phoneNumber, messageBody)
        response = ("You have been created! Welcome to CoronaChat " + newUser.name + ". If you wish to change your name, simply text me !rename [new name]. Text !help for all my commands.");
    }

    return response;
}

const deleteData = async (phoneNumber) =>
{
    let user = await userController.getUserById(phoneNumber);
    let response;
    if(user != null && user!= undefined)
    {
        if(user.pair_number != null && user.pair_number != undefined)
        {
            await userController.unpair(phoneNumber);
        }
        await queueController.deleteData(user)
        await userController.deleteData(user)
        response = "Terrific! All your data has been deleted from our servers! Feel free to signup again whenever!"
    }
    else
    {
        response = ("Hmm.. I don't seem to know you! So I guess you're already deleted! But feel free to signup whenever you want!");
    }

    return response;
}

const forwardMessage = async (fromUser,toUser, message) =>
{

    await twilioClient.messages
    .create({
        body: fromUser.name + ": " + message,
        from: twilioNumber,
        to: toUser.phone_number
    })
    return ""
}

const sendMessage = async (phone_number,message) =>
{
    await twilioClient.messages
    .create({
        body: message,
        from: '+16413292367',
        to: phone_number
    })
    return ""
}

module.exports = {
  handleSMS
}