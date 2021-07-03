const Account = require('../database/controllers/plaidAccount');

exports.find = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Account.find(req.params.userId, true)
  res.status(result.success ? 200 : 400).json(result)
}

exports.list = async (req, res) => {
  result = await Account.list()
  res.status(result.success ? 200 : 400).json(result)
}

exports.delete = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Account.delete(req.params.userId)
  res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Account.update(req.params.userId, req.body)
  if(result.user) { delete result.user.dataValues.password }
  res.status(result.success ? 200 : 400).json(result)
}