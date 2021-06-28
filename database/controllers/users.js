const models = require("../models");
const bcrypt = require("bcrypt");

exports.createUser = async (user) => {
  const newUser = await models.User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    password: await bcrypt.hash(user.password, 10),
    email: user.email,
    permissionLevel: user.permissionLevel,
  });
  return { success: true, user: newUser };
};

exports.getUserById = async (id) => {
  const user = await models.User.findOne({
    where: { id: id },
  });
  if (user) {
    return { success: true, user: user };
  } else {
    return { success: false, error: "User Not Found" };
  }
};

exports.getUsers = async (query = null) => {
  const users = query
    ? await models.User.findAll({ where: query })
    : await models.User.findAll();
  if (users) {
    return { success: true, users: users };
  } else {
    return { success: false, error: "Users Not Found" };
  }
};

exports.getUserByEmail = async (email) => {
  const user = await models.User.findOne({ where: { email: email } });
  return user ? { "success": true, "user": user } : { "success": false, "error": "User Not Found" };
};

exports.deleteUser = async (id) => {
  let result = await getUserById(id);
  if (!result.success) { return result }
  await result.user.destroy({ force: true });
  return { "success": true };
};

exports.updateUser = async (id, newData) => {
  if (req.body.password) { req.body.password = await bcrypt.hash(user.password, 10); }
  let result = await getUserById(id);
  if (!result.success) { return result; }
  updatedUser = await result.user.update(newData);
  return { "success": true, "user": updatedUser };
};
