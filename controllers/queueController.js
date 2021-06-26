const models = require('../database/models');

const checkQueue = async (phone_number,status="new") => {
    
    const newInQueue = await models.Queue.findAll(
        { where: {
            status: 'new'
        }})
    return newInQueue;
  }

const queueUser = async (phone_number) => {
    const queue = await models.Queue.create({
        status: 'new',
        requester_number: phone_number
    })
    return queue
}

const removeFromQueue = async (phone_number) => {
    console.log("Removing from queue...")
    let row = await getQueueItemByNumber(phone_number);
    console.log(row.dataValues)
    await row.destroy({ force: true })
}

const getQueueItemByNumber = async (phone_number) => {
    const row = await models.Queue.findOne({
      where: { requester_number: phone_number }
    });
    if (row) {
      return row;
    }
    console.log("Couldn't Find Queued Row with Number",phone_number)
}

const setStatus = async (phoneNumber,newData) => {
    console.log("Number",phoneNumber)
    let row = await getQueueItemByNumber(phoneNumber);
    updatedRow = await row.update(newData)
    return updatedRow;
}

const deleteData = async (user) => {
    return await models.Queue.destroy({where: { requester_number: user.phone_number }})
}

module.exports = { 
    checkQueue,queueUser,removeFromQueue,setStatus,getQueueItemByNumber,deleteData
}