require('dotenv').config();
const express = require('express');
const Router = express.Router;
// const smsController = require('../controllers/smsController');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
const api = Router();

api.use(express.urlencoded({ extended: false }));


api.get('/', async (req, res) => {
    res.json({ "success": true })
});



module.exports = api;