const models = require("../models");

exports.createResetToken = async (token) => {
  const newToken = await models.ResetToken.create({
    userId: token.userId,
    expiration: token.expiration
  });
  return { success: true, token: newToken };
};

exports.getResetTokenById = async (id) => {
  const token = await models.ResetToken.findOne({ where: { id: id } });
  return token ? { success: true, token: token } : { success: false, error: "Token Not Found" };
};

exports.getResetTokens = async (query = null) => {
  const tokens = query
    ? await models.User.findAll({ where: query })
    : await models.User.findAll();
  return tokens ? { success: true, tokens: tokens } : { success: false, error: "Tokens Not Found" };
};

exports.getResetTokenByUser = async (userId) => {
  const token = await models.ResetToken.findOne({ where: { userId: userId } });
  return token ? { "success": true, "token": token } : { "success": false, "error": "token Not Found" };
};

exports.deleteResetToken = async (id) => {
  let result = await exports.getResetTokenById(id);
  if (!result.success) { return result }
  await result.token.destroy({ force: true });
  return { "success": true };
};

exports.updateResetToken = async (id, newData) => {
  let result = await exports.getResetTokenById(id);
  if (!result.success) { return result; }
  updatedtoken = await result.token.update(newData);
  return { "success": true, "token": updatedtoken };
};
