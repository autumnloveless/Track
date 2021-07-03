const models = require("../models");

exports.create = async (transaction) => {
  const newTransaction = await models.plaidTransaction.create({
    userId: transaction.userId,
    transactionId: transaction.transactionId,
    accountId: transaction.accountId,
    amount: transaction.amount,
    isoCurrencyCode: transaction.isoCurrencyCode,
    unofficialCurrencyCode: transaction.unofficialCurrencyCode,
    category: transaction.category,
    categoryId: transaction.categoryId,
    date: transaction.date,
    authorizedDate: transaction.authorizedDate,
    locationId: transaction.locationId,
    name: transaction.name,
    merchantName: transaction.merchantName,
    paymentMetaId: transaction.paymentMetaId,
    paymentChannel: transaction.paymentChannel,
    pending: transaction.pending,
    pendingTransactionId: transaction.pendingTransactionId,
    accountOwner: transaction.accountOwner,
    transactionCode: transaction.transactionCode,
    transactionType: transaction.transactionType
  });
  return { success: true, transaction: newTransaction };
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

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedTransaction = await result.transaction.update(newData);
  return { "success": true, "transaction": updatedTransaction };
};
