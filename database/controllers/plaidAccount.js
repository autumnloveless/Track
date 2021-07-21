const models = require("../models");

exports.create = async (account) => {
  const newAccount = await models.PlaidAccount.create(account);
  return { success: true, account: newAccount };
};

exports.bulkCreate = async (accounts) => {
  await models.PlaidAccount.bulkCreate(accounts, {updateOnDuplicate: ["balanceAvailable","balanceCurrent","balanceLimit"]});
  return { success: true };
};

exports.find = async (id) => {
  const account = await models.PlaidAccount.findOne({ where: { id: id } });
  return account ? { success: true, account: account } : { success: false, error: "Account Not Found" };
};

exports.list = async (query = null) => {
  const accounts = query
    ? await models.PlaidAccount.findAll({ where: query })
    : await models.PlaidAccount.findAll();
  if (accounts) {
    return { success: true, accounts: accounts };
  } else {
    return { success: false, error: "Accounts Not Found" };
  }
};

exports.delete = async (id) => {
  let result = await exports.find(id);
  if (!result.success) { return result }
  await result.account.destroy({ force: true });
  return { "success": true };
};

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedAccount = await result.account.update(newData);
  return { "success": true, "account": updatedAccount };
};
