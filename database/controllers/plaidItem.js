const models = require("../models");

exports.create = async (item) => {
  const newitem = await models.item.create({
    userId: item.firstName,
    accessToken: item.lastName,
    itemId: item.itemId,
  });
  return { success: true, item: newitem };
};

exports.find = async (id) => {
  const item = await models.item.findOne({ where: { id: id } });
  return item ? { success: true, item: item } : { success: false, error: "item Not Found" };
};

exports.get = async (query = null) => {
  const items = query
    ? await models.item.findAll({ where: query })
    : await models.item.findAll();
  if (items) {
    return { success: true, items: Array.from(items) };
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
