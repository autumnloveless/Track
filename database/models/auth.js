
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
  Auth.associate = (models) => {
    Auth.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Auth;
};