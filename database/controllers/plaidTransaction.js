const models = require("../models");
const { Op } = require("sequelize");

exports.create = async (transaction) => {
  const newTransaction = await models.plaidTransaction.create(transaction);
  return { success: true, transaction: newTransaction };
};

exports.bulkCreate = async (transactions) => {
  await models.plaidTransaction.bulkCreate(transactions);
  return { success: true };
};

exports.upsert = async (transaction) => {
  if(transaction.id) {
    result = await exports.find(transaction.id);
    if (result.success){
      updatedTransaction = await result.transaction.update(newData);
      return { "success": true, "transaction": updatedTransaction };
    } else {
      return await exports.create(transaction);
    }
  } else {
    return await exports.create(transaction);
  }
}

exports.find = async (id) => {
  const transaction = await models.plaidTransaction.findOne({ where: { id: id } });
  return transaction ? { success: true, transaction: transaction } : { success: false, error: "transaction Not Found" };
};

exports.mostRecent = async (itemId) => {
  const transaction = await models.plaidTransaction.findOne({ 
    where: { itemId: itemId }, 
    order: [[ 'createdAt', 'DESC' ]] 
  });
  return transaction ? { success: true, transaction: transaction } : { success: false, error: "transaction Not Found" };
};

exports.list = async (query = null) => {
  const transactions = query
    ? await models.plaidTransaction.findAll({ where: query })
    : await models.plaidTransaction.findAll();
  if (transactions) {
    return { success: true, transactions: transactions };
  } else {
    return { success: false, error: "transactions Not Found" };
  }
};

exports.delete = async (id) => {
  let result = await exports.find(id);
  if (!result.success) { return result }
  await result.transaction.destroy({ force: true });
  return { "success": true };
};

exports.bulkDelete = async (ids) => {
  await models.plaidTransaction.destroy({
    where: { transactionId: {
      [Op.in]: ids 
    }
  }});
}

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedTransaction = await result.transaction.update(newData);
  return { "success": true, "transaction": updatedTransaction };
};
