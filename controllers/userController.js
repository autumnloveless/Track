const usersDB = require('../database/controllers/users');

exports.getUserById = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await usersDB.getUserById(req.params.userId, true)
  res.status(result.success ? 200 : 400).json(result)
}

exports.getUsers = async (req, res) => {
  result = await usersDB.getUsers()
  res.status(result.success ? 200 : 400).json(result)
}

exports.deleteUser = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await userController.deleteUser(req.params.userId)
  res.status(result.success ? 200 : 400).json(result)
}

exports.updateUser = async (req, res) => {
  if(req.user.id != req.params.userId) { return res.status(403).json({ error: 'unauthorized' }) }
  result = await usersDB.updateUser(req.params.userId, req.body)
  if(result.user) { delete result.user.dataValues.password }
  res.status(result.success ? 200 : 400).json(result)
}