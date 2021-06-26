const models = require('../database/models');

const createUser = async (phone_number, name=null) => {
  try {
    const user = await models.User.create({
      phone_number:phone_number,
      name: name,
    });
    return user
  } catch (error) {
    console.log(error)
  }
}
  
const getUserById = async (id) => {
  try {
    const user = await models.User.findOne({
      where: { id: id }
    });
    if (user) {
      return user;
    }
    console.log("Couldn't Find User with ID",id)
  } catch (error) {
    console.log(error)
  }
}

const deleteData = async (user) =>
{
  const response = await user.destroy({ force: true })
  return response;
}

const updateUser = async (newData, id) =>
{
  let user = await getUserById(id);
  updatedUser = await user.update(newData)
  return updatedUser;
}

module.exports = {
  createUser,getUserById,deleteData,updateUser,unpair,pair
}