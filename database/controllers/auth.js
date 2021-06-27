const models = require("../models");
const jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  await createAuth({
    userId: user.id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  return { accessToken: accessToken, refreshToken: refreshToken };
};

exports.regenerateToken = async (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
  await updateAuth({ id: user.id, accessToken: accessToken });

  return accessToken;
};

exports.createAuth = async (auth) => {
  const newAuth = await models.Auth.create({
    userId: auth.userId,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  });
};

exports.getAuthById = async (id) => {
  const auth = await models.Auth.findOne({ where: { id: id } });
  return auth ? { success: true, auth: auth } : { success: false, error: "Auth Record Not Found" };
};

exports.deleteAuth = async (refreshToken) => {
  auth = await getAuthByRefreshToken(refreshToken);
  if (!auth.success) { return auth; }
  await auth.destroy({ force: true });
  return { success: true };
};

exports.updateAuth = async (newData) => {
  auth = await getAuthById(newData.id);
  if (!auth.success) { return auth; }
  updatedAuth = await auth.update(newData);
  return { success: true };
};

exports.getAuthByRefreshToken = async (refreshToken) => {
  const auth = await models.Auth.findOne({ where: { refreshToken: refreshToken } });
  return auth ? { success: true, auth: auth } : { success: false, error: "Auth Record Not Found" };
};
