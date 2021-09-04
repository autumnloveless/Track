const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const bcrypt = require("bcrypt");
const usersDB = require('../database/controllers/users');
const Item = require('../database/controllers/plaidItem')
const plaid = require('plaid');
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
});

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.development,
  options: { version: '2020-09-14' }
});


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
  rollbar.log("Verifying Plaid Webhook");
  const signedJwt = req.headers['plaid-verification'];
  const decodedJWT = jwt_decode(signedJwt);
  const decodedJWTHeader = jwt_decode(signedJwt, { header: true });
  if (decodedJWTHeader.alg != "ES256" ) { 
    rollbar.error("Plaid Webhook Invalid - NO ALG",  {"decodedJWT": decodedJWT, "plaid-verification header": signedJwt})
    return res.sendStatus(403) 
  }
  const keyId = decodedJWTHeader.kid;
  const response = await client.getWebhookVerificationKey(keyId).catch((err) => { 
    rollbar.error("Plaid Webhook Invalid - Error Getting Verification", err);
    return res.sendStatus(401)
  });
  const key = response.key;

  try {
    jwt.verify(signedJwt, key, { maxAge: '5 min' });
  } catch (err) {
    rollbar.error("Plaid Webhook Invalid - Invalid JWT", err, signedJwt, key); 
    return res.sendStatus(403)
  }

  const { item } = await Item.findByItemId(req.body.item_id).catch(e => { 
    rollbar.error("Error finding item with provided id: ", req.body.item_id, req.body, e); 
    return res.sendStatus(401)
  });
  req.user = { id: item.userId }
  rollbar.log("Plaid Webhook Validated Successfully");
  next();
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