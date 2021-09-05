'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    name: DataTypes.STRING,
  }, {});
  Tag.associate = function(models) {
    Tag.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Tag;
};