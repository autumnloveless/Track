const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const plaidController = require('./controllers/plaidController');
const accountController = require('./controllers/accountController');
const transactionController = require('./controllers/transactionController');
const util = require('./controllers/utilityController');
const auth = require('./middlewares/authenticate');
const api = express.Router();

api.get('/', async (req, res) => {
  const docsUrl = "https://github.com/autumnloveless/Track"
  res.json(`Welcome to the Track API. You can find documentation for accessing it here: ${docsUrl} `)
});

// ========================== USERS ==========================
api.get('/users', auth.authenticateToken, auth.minRole(2), userController.getUsers, util.handleErrors);
api.get('/users/:userId', auth.authenticateToken, userController.getUserById, util.handleErrors);
api.put('/users/:userId', auth.authenticateToken, userController.updateUser, util.handleErrors);
api.delete('/users/:userId', auth.authenticateToken, userController.deleteUser, util.handleErrors);

// ========================== AUTH ==========================
api.post('/login', auth.loginMatch, authController.login, util.handleErrors);
api.post('/token', authController.refreshToken, util.handleErrors);
api.post('/register', authController.register, util.handleErrors);
api.post('/registerAdmin', auth.authenticateToken, auth.minRole(2), authController.registerAdmin, util.handleErrors);

// ========================== PLAID SETUP ==========================
api.get('/plaid/get_link_token', auth.authenticateToken, plaidController.getLinkToken, util.handleErrors);
api.post('/plaid/set_access_token', auth.authenticateToken, plaidController.setAccessToken, util.handleErrors);
api.get('/plaid/update_transactions', auth.authenticateToken, plaidController.updateTransactions, util.handleErrors);

// ========================== PLAID WEBHOOKS ==========================
api.post('/plaid/initial_update', auth.verifyPlaidWebhook, plaidController.handleTransactionsWebhook, util.handleErrors);
api.post('/plaid/historical_update', auth.verifyPlaidWebhook, plaidController.handleTransactionsWebhook, util.handleErrors);
api.post('/plaid/default_update', auth.verifyPlaidWebhook, plaidController.handleTransactionsWebhook, util.handleErrors);
api.post('/plaid/transactions_removed', auth.verifyPlaidWebhook, plaidController.handleTransactionsWebhook, util.handleErrors);

// ========================== PLAID ACCOUNT ==========================
api.get('/accounts', auth.authenticateToken, accountController.list, util.handleErrors);
api.get('/accounts/:accountId', auth.authenticateToken, accountController.find, util.handleErrors);
api.put('/accounts/:accountId', auth.authenticateToken, accountController.update, util.handleErrors);
api.delete('/accounts/:accountId', auth.authenticateToken, accountController.delete, util.handleErrors);

// ========================== PLAID TRANSACTIONS ==========================
api.get('/accounts/:accountId/transactions', auth.authenticateToken, transactionController.list, util.handleErrors);
api.get('/accounts/:accountId/transactions/:transactionId', auth.authenticateToken, transactionController.find, util.handleErrors);
api.put('/accounts/:accountId/transactions/:transactionId', auth.authenticateToken, transactionController.list, util.handleErrors);
api.delete('/accounts/:accountId/transactions/:transactionId', auth.authenticateToken, transactionController.list, util.handleErrors);

module.exports = api;