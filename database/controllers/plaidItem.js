const models = require("../models");

exports.create = async (item) => {
  const newitem = await models.PlaidItem.create({
    userId: item.userId,
    accessToken: item.accessToken,
    itemId: item.itemId,
  });
  return { success: true, item: newitem };
};

exports.find = async (id) => {
  const item = await models.PlaidItem.findOne({ where: { id: id } });
  return item ? { success: true, item: item } : { success: false, error: "item Not Found" };
};

exports.findByItemId = async (id) => {
  const item = await models.PlaidItem.findOne({ where: { itemId: id } });
  return item ? { success: true, item: item } : { success: false, error: "item Not Found" };
};

exports.get = async (query = null) => {
  const items = query
    ? await models.PlaidItem.findAll({ where: query })
    : await models.PlaidItem.findAll();
  if (items) {
    return { success: true, items: items };
  } else {
    return { success: false, error: "items Not Found" };
  }
};

exports.delete = async (id) => {
  let result = await exports.find(id);
  if (!result.success) { return result }
  await result.item.destroy({ force: true });
  return { "success": true };
};

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedItem = await result.item.update(newData);
  return { "success": true, "item": updatedItem };
};
