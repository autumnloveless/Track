'use strict';
module.exports = (sequelize, DataTypes) => {
  const ResetToken = sequelize.define('ResetToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    expiration: DataTypes.DATE
  }, {});
  ResetToken.associate = function(models) {
    // associations can be defined here
  };
  return ResetToken;
};