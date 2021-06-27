if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require('express');
const Router = express.Router;
const userController = require('../controllers/userController');
const passport = require('passport');
const passportConfig = require('../passport-config');
passportConfig.initialize(passport);
const session = require('express-session');
const api = Router();

api.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

api.use(express.urlencoded({ extended: false }));
api.use(passport.initialize());
api.use(passport.session());

api.get('/', async (req, res) => {
    res.json({ "success": true })
});

api.get('/login', async (req, res) => {
  res.json({ "success": true })
});

api.post('/login', passport.authenticate('local'), 
(req, res) => {
  res.json({ "success": true , "user": req.user })
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