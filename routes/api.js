require('dotenv').config();
const express = require('express');
const Router = express.Router;
const userController = require('../controllers/userController');
const passport = require(passport);
const initializePassport = require('../passport-config');
initializePassport(passport)

// const smsController = require('../controllers/smsController');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
const api = Router();

api.use(express.urlencoded({ extended: false }));


api.get('/', async (req, res) => {
    res.json({ "success": true })
});

api.get('/login', async (req, res) => {
  res.json({ "success": true })
});

api.get('/register', async (req, res) => {
  res.json({ "success": true })
});

api.post('/register', async (req, res) => {
  try {
    user = await userController.createUser(req.body)
    res.status(200).json({ "success": true, "user": user })
  }
  catch(error) {
    res.status(500).json({ "success": false, "error": error })
  }
});

api.patch('')



module.exports = api;