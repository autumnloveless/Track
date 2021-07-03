'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaidAccount = sequelize.define('PlaidAccount', {
    userId: DataTypes.STRING,
    accountId: DataTypes.STRING,
    itemId: DataTypes.STRING,
    balanceAvailable: DataTypes.NUMBER,
    balanceCurrent: DataTypes.NUMBER,
    balanceLimit: DataTypes.NUMBER,
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
    // associations can be defined here
  };
  return PlaidAccount;
};