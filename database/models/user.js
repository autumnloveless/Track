
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { 
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    },
    permissionLevel: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Auth, {
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
  };
  return User;
};