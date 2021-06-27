const usersDB = require('./database/controllers/users');
  
exports.getUserById = async (req, res) => {
  user = await usersDB.getUserById(req.params.userId)
  res.status(200).json({ "success": true, "user": user })
}

exports.getUsers = async (req, res) => {
  users = await usersDB.getUsers()
  res.status(200).json({ "success": true, "users": users })
}

exports.deleteUser = async (req, res) => {
  result = await userController.deleteUser(req.params.userId)
  res.status(200).json({ "success": result })
}

exports.updateUser = async (req, res) => {
  user = await usersDB.updateUser(req.params.userId, req.body)
  res.status(200).json({ "success": true, "user": user })
}