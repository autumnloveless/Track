const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const plaidController = require('./controllers/plaidController');
const accountController = require('./controllers/accountController');
const transactionController = require('./controllers/transactionController');
const tagController = require('./controllers/tagController');
const transactionTagController = require('./controllers/transactionTagController');
const util = require('./controllers/utilityController');
const auth = require('./middlewares/authenticate');
const api = express.Router();

api.get('/', async (req, res) => {
  const docsUrl = "https://github.com/autumnloveless/Track"
  res.json({"hello": `Welcome to the Track API. You can find documentation for accessing it here: ${docsUrl} `})
});

// ========================== USERS ==========================
api.get('/users', auth.authenticateToken, auth.minRole(2), userController.getUsers, util.handleErrors);
api.get('/user', auth.authenticateToken, userController.getUserById, util.handleErrors);
api.put('/user', auth.authenticateToken, userController.updateUser, util.handleErrors);
api.delete('/user', auth.authenticateToken, userController.deleteUser, util.handleErrors);

// ========================== AUTH ==========================
api.post('/auth/login', auth.loginMatch, authController.login, util.handleErrors);
api.get('/auth/logout', auth.authenticateToken, authController.logout, util.handleErrors);
api.post('/auth/forgotPassword', authController.forgotPassword, util.handleErrors);
api.post('/auth/resetPassword', authController.resetPassword, util.handleErrors);
api.get('/auth/token', authController.refreshToken, util.handleErrors);
api.post('/auth/register', authController.register, util.handleErrors);
api.post('/auth/registerAdmin', auth.authenticateToken, auth.minRole(2), authController.registerAdmin, util.handleErrors);

// ========================== PLAID SETUP ==========================
api.get('/plaid/link_token', auth.authenticateToken, plaidController.getLinkToken, util.handleErrors);
api.post('/plaid/access_token', auth.authenticateToken, plaidController.setAccessToken, util.handleErrors);
api.get('/plaid/update_transactions', auth.authenticateToken, plaidController.updateTransactions, util.handleErrors);

// ========================== PLAID WEBHOOKS ==========================
api.post('/plaid/webhook', auth.verifyPlaidWebhook, plaidController.handleTransactionsWebhook, util.handleErrors);

// ========================== PLAID ACCOUNT ==========================
api.get('/accounts', auth.authenticateToken, accountController.listByUser, util.handleErrors);
api.get('/accounts/:accountId', auth.authenticateToken, accountController.find, util.handleErrors);
api.put('/accounts/:accountId', auth.authenticateToken, accountController.update, util.handleErrors);

// ========================== PLAID TRANSACTIONS ==========================
api.get('/transactions', auth.authenticateToken, transactionController.listByUser, util.handleErrors);
api.put('/transactions/bulkUpdate', auth.authenticateToken, transactionController.bulkUpdate, util.handleErrors);
api.get('/transactions/:transactionId', auth.authenticateToken, transactionController.find, util.handleErrors);
api.put('/transactions/:transactionId', auth.authenticateToken, transactionController.update, util.handleErrors);

module.exports = api;