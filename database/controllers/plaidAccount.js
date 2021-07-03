const models = require("../models");

exports.create = async (account) => {
  const newAccount = await models.plaidAccount.create(account);
  return { success: true, account: newAccount };
};

exports.bulkCreate = async (accounts) => {
  await models.plaidAccount.bulkCreate(accounts);
  return { success: true };
};

exports.upsert = async (account) => {
  if(account.id) {
    result = await exports.find(account.id);
    if (result.success){
      updatedAccount = await result.account.update(newData);
      return { "success": true, "account": updatedAccount };
    } else {
      return await exports.create(account);
    }
  } else {
    return await exports.create(account);
  }
}

exports.find = async (id) => {
  const account = await models.plaidAccount.findOne({ where: { id: id } });
  return account ? { success: true, account: account } : { success: false, error: "account Not Found" };
};

exports.list = async (query = null) => {
  const accounts = query
    ? await models.plaidAccount.findAll({ where: query })
    : await models.plaidAccount.findAll();
  if (accounts) {
    return { success: true, accounts: accounts };
  } else {
    return { success: false, error: "accounts Not Found" };
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
