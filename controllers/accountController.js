const Account = require('../database/controllers/plaidAccount');
const auth = require('../middlewares/authenticate');

exports.find = async (req, res) => {
  result = await Account.find(req.params.userId, true)
  if(!auth.isAllowed(req.user, result?.account?.userId)) { return res.status(403).json({ error: 'unauthorized' }) }
  res.status(result.success ? 200 : 400).json(result)
}

exports.list = async (req, res) => {
  result = await Account.list({userId: req.user.id})
  res.status(result.success ? 200 : 400).json(result)
}

exports.delete = async (req, res) => {
  result = await Account.delete(req.params.userId)
  res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
  result = await Account.update(req.params.userId, req.body)
  if(result.user) { delete result.user.dataValues.password }
  res.status(result.success ? 200 : 400).json(result)
}