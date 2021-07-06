const Transaction = require('../database/controllers/plaidTransaction');

exports.find = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Transaction.find(req.params.userId, true)
  res.status(result.success ? 200 : 400).json(result)
}

exports.list = async (req, res) => {
result = await Transaction.list()
  res.status(result.success ? 200 : 400).json(result)
}

exports.listByUser = async (req, res) => {
  result = await Transaction.listByUser(req.user.id)
  res.status(result.success ? 200 : 400).json(result)
}

exports.delete = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Transaction.delete(req.params.userId)
  res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await Transaction.update(req.params.userId, req.body)
  if(result.user) { delete result.user.dataValues.password }
  res.status(result.success ? 200 : 400).json(result)
}