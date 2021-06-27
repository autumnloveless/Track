const express = require('express');
const passport = require('passport');
const passportConfig = require('./passport-config');
passportConfig.initialize(passport);
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const util = require('./controllers/utilityController');
const auth = require('./middlewares/authenticate')

const api = express.Router();
api.use(passport.initialize());

api.get('/', auth.authenticateToken , async (req, res) => {
  res.json('Welcome to the Track API. You can find documentation for accessing it here: ')
});

api.get('/users', userController.getUsers, util.handleErrors);
api.get('/users/:userId', userController.getUserById, util.handleErrors);
api.patch('/users/:userId', userController.updateUser, util.handleErrors);
api.delete('/users/:userId', userController.deleteUser, util.handleErrors);

api.post('/login', passport.authenticate('local', { failWithError: true }), authController.login, util.handleErrors);
api.post('/token', authController.refreshToken, util.handleErrors);
api.post('/register', authController.register, util.handleErrors);
api.post('/registerAdmin', authController.registerAdmin, util.handleErrors);

module.exports = api;