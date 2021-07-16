const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersDB = require('../database/controllers/users');
const Item = require('../database/controllers/plaidItem')
const plaid = require('plaid');


exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) { return res.sendStatus(403) }
      req.user = user;
      req.token = token;
      next();
  })
}

exports.verifyPlaidWebhook = async (req, res, next) => {
  const verificationHeader = req.headers['Plaid-Verification'];
  decodedJWT = jwt.decode(verificationHeader);
  if (decodedJWT.alg != "ES256" ) { return res.sendStatus(403) }
  const keyId = decodedJWT.kid;
  const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.development,
    options: { version: '2020-09-14' }
  });
  const response = await client.getWebhookVerificationKey(keyId).catch((err) => { return res.sendStatus(401)});
  const key = response.key;

  jwt.verify(verificationHeader, key, async (err) => {
    if (err) { return res.sendStatus(403) }
    const { item } = await Item.findByItemId(req.body.item_id)
    req.user = { id: item.userId }
    next();
  });
}

exports.loginMatch = async (req, res, next) => {
  if (!req.body.email || !req.body.password) { return res.status(400).json({ "success": false, "error": "Invalid email or password"}); } 
  result = await usersDB.getUserByEmail(req.body.email);
  if (!result.success) { return res.status(400).json({ "success": false, "error": "Invalid email or password"}); }
  if (await bcrypt.compare(req.body.password, result.user.password)){
    req.user = {
      id: result.user.id,
      email: result.user.email,
      permissionLevel: result.user.permissionLevel,
      provider: 'email',
      firstName: result.user.firstName,
      lastName: result.user.lastName
    };
    return next();
  } else {
    return res.status(400).json({ "success": false, "error": "Invalid email or password"});
  }
}

exports.minRole = (requiredPermissionLevel) => async (req, res, next) => {
  if(req.user.permissionLevel >= requiredPermissionLevel){
    return next();
  } else {
    return res.status(403).json({ success: false });
  }
}

exports.isAllowed = (user, targetId) => {
  return (user?.permissionLevel > 2 || user?.id == targetId)
}