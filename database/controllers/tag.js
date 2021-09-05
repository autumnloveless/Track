const models = require("../models");

exports.create = async (tag) => {
  const newTag = await models.Tag.create(tag);
  return { success: true, tag: newTag };
};

exports.find = async (id) => {
  const tag = await models.Tag.findOne({ where: { id: id } });
  return tag ? { success: true, tag: tag } : { success: false, error: "Tag Not Found" };
};

exports.get = async (query = null) => {
  const tags = query
    ? await models.Tag.findAll({ where: query })
    : await models.Tag.findAll();
  if (tags) {
    return { success: true, tags: tags };
  } else {
    return { success: false, error: "Tags Not Found" };
  }
};

exports.delete = async (id) => {
  let result = await exports.find(id);
  if (!result.success) { return result }
  await result.tag.destroy();
  return { success: true };
};

exports.update = async (id, newData) => {
  let result = await exports.find(id);
  if (!result.success) { return result; }
  updatedTag = await result.tag.update(newData);
  return { success: true, tag: updatedTag };
};
