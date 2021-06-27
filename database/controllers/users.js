exports.createUser = async (user) => {
  try {
    const newUser = await models.User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      password: await bcrypt.hash(user.password, 10),
      email: user.email,
      permissionLevel: user.permissionLevel,
    });
    return newUser;
  } catch (error) {
    throw new Error(error.errors.map((e) => e.message).join(", "));
  }
};

exports.getUserById = async (id) => {
  const user = await models.User.findOne({
    where: { id: id },
  });
  if (user) {
    return user;
  } else {
    return { error: "User Not Found" };
  }
};

exports.getUsers = async (query = null) => {
  const users = query
    ? await models.User.findAll({ where: query })
    : await models.User.findAll();
  if (users) {
    return users;
  } else {
    return { error: "Users Not Found" };
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const user = await models.User.findOne({
      where: { email: email },
    });
    if (user) {
      return user;
    }
    console.log("Couldn't Find User with ID", id);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (id) => {
  let user = await getUserById(id);
  if (user.id == null) {
    return false;
  }
  await user.destroy({ force: true });
  return true;
};

exports.updateUser = async (id, newData) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(user.password, 10);
  }
  let user = await getUserById(id);
  if (user.id == null) {
    return user;
  }
  updatedUser = await user.update(newData);
  return updatedUser;
};
