'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    phone_number: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    pair_number: DataTypes.STRING,
    pair_date_utc: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.User, {
      foreignKey: 'pair_number',
      as: 'pair',
      onDelete: 'CASCADE',
    });
  };
  return User;
};