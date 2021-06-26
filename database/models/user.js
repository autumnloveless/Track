'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Transaction, {
      foreignKey: 'pair_number',
      as: 'pair',
      onDelete: 'CASCADE',
    });
  };
  return User;
};