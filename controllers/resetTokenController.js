const ResetToken = require('../database/controllers/resetToken');

exports.getResetTokenById = async (req, res) => {
  result = await ResetToken.getResetTokenById(req.user.id, true)
  res.status(result.success ? 200 : 400).json(result)
}

exports.getResetTokens = async (req, res) => {
  result = await ResetToken.getResetTokens()
  res.status(result.success ? 200 : 400).json(result)
}

exports.deleteResetToken = async (req, res) => {
  result = await ResetToken.deleteResetToken(req.user.id)
  res.status(result.success ? 200 : 400).json(result)
}

exports.updateResetToken = async (req, res) => {
  result = await ResetToken.updateResetToken(req.user.id, req.body)
  res.status(result.success ? 200 : 400).json(result)
}