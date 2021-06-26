# Corona Chat

## Introduction

> A friend of mine posted on facebook that they would love an app that would allow them to quickly and anonymously connect to another person for a 10 minute emote session. It seemed like a cool idea, so here it is. With just text message, you can easily create an account, and join the queue to be paired with someone else. All messaging is done through the provided number, and at the end of 10 minutes (or sooner if you choose) you are unpaired, and can pair with someone else.

## How to use

> 
`!help` - displays a list of available commands
<br>`!signup [your name]` - create an account with your name
<br>`!deleteme` - delete your account and all information related to your phone number
<br>`!pair` - join the queue to be paired up with another person
<br>`!unpair` or `!stop` - leave the queue, or unpair with someone you are already paired with
<br>`!message [message text]` - sends your message text to the person you are paired with
<br>`[message text]` - also sends your message to the person you are paired with.
<br> 

## Installation - If you want to make it yourself

1. `Git clone` and `cd coronachat`
2. Install dependencies: `npm install` 
3. Set up database: you will need a postgres database to make this work. I used `ElephantSQL` to very quickly spin up a postgres machine (literally 2 minutes) for free. 
4. Set up a `twilio` account
5. Update  `.env` with your `postgres` and `twilio` information
6. Run database migrations `npx sequelize db:migrate`
7. If running locally, use this to forward the twilio traffic to your localhost: 
8. `twilio phone-numbers:update "PUT YOUR TWILIO PHONE NUMBER HERE" --sms-url="http://localhost:3300/sms"  `
9. Run project `npm run start`
10. Start texting the  `twilio` number to interact!
