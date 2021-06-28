const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const util = require('./controllers/utilityController');
const auth = require('./middlewares/authenticate')

const api = express.Router();

api.get('/', async (req, res) => {
  res.json('Welcome to the Track API. You can find documentation for accessing it here: ')
});

api.get('/users', auth.authenticateToken, auth.minRole(2), userController.getUsers, util.handleErrors);
api.get('/users/:userId', auth.authenticateToken, userController.getUserById, util.handleErrors);
api.patch('/users/:userId', auth.authenticateToken, userController.updateUser, util.handleErrors);
api.delete('/users/:userId', auth.authenticateToken, userController.deleteUser, util.handleErrors);

api.post('/login', auth.loginMatch, authController.login, util.handleErrors);
api.post('/token', authController.refreshToken, util.handleErrors);
api.post('/register', authController.register, util.handleErrors);
api.post('/registerAdmin', auth.authenticateToken, auth.minRole(2), authController.registerAdmin, util.handleErrors);

module.exports = api;