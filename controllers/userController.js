const models = require('../database/models');

const createUser = async (phone_number, name=null) => {
    try {
      const user = await models.User.create({
        phone_number:phone_number,
        name: name,
        pair_number: null,
        pair_date_utc: null
      });
      return user
    } catch (error) {
      console.log(error)
    }
  }
  
  const getUserById = async (phone_number) => {
    try {
      const user = await models.User.findOne({
        where: { phone_number: phone_number }
      });
      if (user) {
        return user;
      }
      console.log("Couldn't Find User with Number",phone_number)
    } catch (error) {
      console.log(error)
    }
  }

  // TODO - testing
  const deleteData = async (user) =>
  {
    const response = await user.destroy({ force: true })
    return response;
  }

  const updateUser = async (newData, phoneNumber) =>
  {
    let user = await getUserById(phoneNumber);
    updatedUser = await user.update(newData)
    return updatedUser;
  }

  const unpair = async (phoneNumber) =>
  {
    let user = await getUserById(phoneNumber);
    let linkedUser = await user.getPair();

    await user.update({
        pair_number: null,
        pair_date_utc: null
    });

    await linkedUser.update({
        pair_number: null,
        pair_date_utc: null
    });

    return user;
  }

  const pair = async(phoneNumber1,phoneNumber2) => {
    let user1 = await getUserById(phoneNumber1);
    let user2 = await getUserById(phoneNumber2);

    await user1.update({
        pair_number: phoneNumber2,
        pair_date_utc: Date.now()
    });

    await user2.update({
        pair_number: phoneNumber1,
        pair_date_utc: Date.now()
    });

    return true;
  }
  
  module.exports = {
    createUser,getUserById,deleteData,updateUser,unpair,pair
  }