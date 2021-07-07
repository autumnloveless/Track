const models = require("../models");
const { Op } = require("sequelize");

exports.create = async (transaction) => {
  const newTransaction = await models.PlaidTransaction.create(transaction);
  return { success: true, transaction: newTransaction };
};

exports.bulkCreate = async (transactions) => {
  await models.PlaidTransaction.bulkCreate(transactions);
  return { success: true };
};

exports.find = async (id) => {
  const transaction = await models.PlaidTransaction.findOne({ where: { id: id } });
  return transaction ? { success: true, transaction: transaction } : { success: false, error: "transaction Not Found" };
};

exports.list = async (query = null) => {
  const transactions = query
    ? await models.PlaidTransaction.findAll({ where: query })
    : await models.PlaidTransaction.findAll();
  if (transactions) {
    return { success: true, transactions: transactions };
  } else {
    return { success: false, error: "transactions Not Found" };
  }
};

exports.delete = async (id) => {
  await models.PlaidTransaction.destroy({ 
    where: {
      [Op.or]: [
        { id: id },
        { transactionId: id }
      ]
    }
  });
  return { "success": true };
};

exports.bulkDelete = async (ids) => {
  await models.PlaidTransaction.destroy({
    where: { transactionId: {
      [Op.in]: ids 
    }
  }});
}

exports.update = async (transaction, newData) => {
  updatedTransaction = await transaction.update(newData);
  return { "success": true, "transaction": updatedTransaction };
};
