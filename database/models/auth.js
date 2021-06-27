'use strict';
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define('Auth', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  }, {});
  Auth.belongsTo(models.User);

  return Auth;
};