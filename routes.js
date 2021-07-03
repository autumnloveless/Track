const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const plaidController = require('./controllers/plaidController');
const util = require('./controllers/utilityController');
const auth = require('./middlewares/authenticate');
const api = express.Router();

api.get('/', async (req, res) => {
  const docsUrl = "https://github.com/autumnloveless/Track"
  res.json(`Welcome to the Track API. You can find documentation for accessing it here: ${docsUrl} `)
});

api.get('/users', auth.authenticateToken, auth.minRole(2), userController.getUsers, util.handleErrors);
api.get('/users/:userId', auth.authenticateToken, userController.getUserById, util.handleErrors);
api.patch('/users/:userId', auth.authenticateToken, userController.updateUser, util.handleErrors);
api.delete('/users/:userId', auth.authenticateToken, userController.deleteUser, util.handleErrors);

api.post('/login', auth.loginMatch, authController.login, util.handleErrors);
api.post('/token', authController.refreshToken, util.handleErrors);
api.post('/register', authController.register, util.handleErrors);
api.post('/registerAdmin', auth.authenticateToken, auth.minRole(2), authController.registerAdmin, util.handleErrors);

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
api.post('/plaid/get_link_token', auth.authenticateToken, plaidController.getLinkToken, util.handleErrors);
// Exchange token flow - exchange a Link public_token for an API access_token
api.post('/plaid/set_access_token', auth.authenticateToken, plaidController.setAccessToken, util.handleErrors);
api.get('/plaid/generateAccounts', auth.authenticateToken, plaidController.generateAccounts, util.handleErrors);

api.get('/accounts', auth.authenticateToken, accountController.list, util.handleErrors);





module.exports = api;