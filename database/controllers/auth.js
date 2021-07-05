const models = require("../models");
const jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  await exports.createAuth({
    userId: user.id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  return { success: true, accessToken: accessToken, refreshToken: refreshToken };
};

exports.regenerateToken = async (authId, user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  result = await exports.updateAuth(authId, { accessToken: accessToken });
  return { success: true, accessToken: accessToken };
};

exports.createAuth = async (auth) => {
  const newAuth = await models.Auth.create({
    userId: auth.userId,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  });
  return { success: true, auth: newAuth }
};

exports.getAuthById = async (id) => {
  const auth = await models.Auth.findOne({ where: { id: id } });
  return auth ? { success: true, auth: auth } : { success: false, error: "Auth Record Not Found" };
};

exports.deleteAuth = async (accessToken) => {
  result = await exports.getAuthByAccessToken(accessToken);
  if (!result.success) { return result; }
  await result.auth.destroy({ force: true });
  return { success: true };
};

exports.updateAuth = async (id, newData) => {
  result = await exports.getAuthById(id);
  if (!result.success) { return result; }
  updatedAuth = await result.auth.update(newData);
  return { success: true, auth: updatedAuth };
};

exports.getAuthByRefreshToken = async (refreshToken) => {
  const auth = await models.Auth.findOne({ where: { refreshToken: refreshToken } });
  return auth ? { success: true, auth: auth } : { success: false, error: "Auth Record Not Found" };
};

exports.getAuthByAccessToken = async (accessToken) => {
  const auth = await models.Auth.findOne({ where: { accessToken: accessToken } });
  return auth ? { success: true, auth: auth } : { success: false, error: "Auth Record Not Found" };
};
