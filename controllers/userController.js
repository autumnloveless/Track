const usersDB = require('../database/controllers/users');
  
exports.getUserById = async (req, res) => {
  result = await usersDB.getUserById(req.params.userId)
  res.status(result.status ? 200 : 400).json(result)
}

exports.getUsers = async (req, res) => {
  result = await usersDB.getUsers()
  res.status(result.status ? 200 : 400).json(result)
}

exports.deleteUser = async (req, res) => {
  result = await userController.deleteUser(req.params.userId)
  res.status(result.status ? 200 : 400).json(result)
}

exports.updateUser = async (req, res) => {
  user = await usersDB.updateUser(req.params.userId, req.body)
  res.status(result.status ? 200 : 400).json(result)
}