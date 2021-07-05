const usersDB = require('../database/controllers/users');

exports.getUserById = async (req, res) => {
  result = await usersDB.getUserById(req.user.id, true)
  res.status(result.success ? 200 : 400).json(result)
}

exports.getUsers = async (req, res) => {
  result = await usersDB.getUsers()
  res.status(result.success ? 200 : 400).json(result)
}

exports.deleteUser = async (req, res) => {
  result = await usersDB.deleteUser(req.user.id)
  res.status(result.success ? 200 : 400).json(result)
}

exports.updateUser = async (req, res) => {
  result = await usersDB.updateUser(req.user.id, req.body)
  if(result.user) { delete result.user.dataValues.password }
  res.status(result.success ? 200 : 400).json(result)
}