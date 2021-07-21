'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaidAccount = sequelize.define('PlaidAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    accountId: DataTypes.STRING,
    itemId: DataTypes.STRING,
    balanceAvailable: DataTypes.FLOAT,
    balanceCurrent: DataTypes.FLOAT,
    balanceLimit: DataTypes.FLOAT,
    isoCurrencyCode: DataTypes.STRING,
    unofficialCurrencyCode: DataTypes.STRING,
    lastUpdatedDateTime: DataTypes.DATE,
    mask: DataTypes.STRING,
    name: DataTypes.STRING,
    officialName: DataTypes.STRING,
    type: DataTypes.STRING,
    subtype: DataTypes.STRING,
    verificationStatus: DataTypes.STRING,
  }, {});
  PlaidAccount.associate = function(models) {
    PlaidAccount.hasMany(models.PlaidTransaction, {
      onDelete: 'CASCADE',
      foreignKey: 'accountId',
      targetKey:'accountId'
    });
  };
  return PlaidAccount;
};