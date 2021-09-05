const models = require("../models");

exports.create = async (transactionTag) => {
  const newTransactionTag = await models.TransactionTag.create(transactionTag);
  return { success: true, transactionTag: newTransactionTag };
};

exports.find = async (id) => {
  const transactionTag = await models.TransactionTag.findOne({ where: { id: id } });
  return transactionTag ? { success: true, transactionTag: transactionTag } : { success: false, error: "Transaction Tag Not Found" };
};

exports.get = async (query = null) => {
  const transactionTags = query
    ? await models.TransactionTag.findAll({ where: query })
    : await models.TransactionTag.findAll();
  if (transactionTags) {
    return { success: true, transactionTags: transactionTags };
  } else {
    return { success: false, error: "Transaction Tags Not Found" };
  }
};

exports.delete = async (id) => {
  let result = await exports.find(id);
  if (!result.success) { return result }
  await result.transactionTag.destroy();
  return { success: true };
};

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedTransactionTag = await result.transactionTag.update(newData);
  return { success: true, transactionTag: updatedTransactionTag };
};
