require('dotenv').config();
const { Router } = require('express');
const smsController = require('../controllers/smsController');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/sms', async (req, res) => {
    const message = await smsController.handleSMS(req.body.From,req.body.Body);

    if(message != "")
    {
        const twiml = new MessagingResponse();
        twiml.message(message);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    }
  });

module.exports = router;