'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaidUser = sequelize.define('PlaidItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    itemId: DataTypes.STRING
  }, {});
  PlaidUser.associate = function(models) {
    // associations can be defined here
  };
  return PlaidUser;
};