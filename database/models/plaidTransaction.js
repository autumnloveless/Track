'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaidTransaction = sequelize.define('PlaidTransaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    itemId: DataTypes.STRING,
    accountId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    read: DataTypes.BOOLEAN,
    starred: DataTypes.BOOLEAN,
    isoCurrencyCode: DataTypes.STRING,
    unofficialCurrencyCode: DataTypes.STRING,
    category: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    date: DataTypes.DATE,
    authorizedDate: DataTypes.DATE,
    locationId: DataTypes.STRING,
    name: DataTypes.STRING,
    merchantName: DataTypes.STRING,
    paymentChannel: DataTypes.STRING,
    pending: DataTypes.BOOLEAN,
    pendingTransactionId: DataTypes.STRING,
    accountOwner: DataTypes.STRING,
    transactionCode: DataTypes.STRING,
    transactionType: DataTypes.STRING,
    tags: DataTypes.STRING,
    photoLinks: DataTypes.STRING,
  }, {});
  PlaidTransaction.associate = function(models) {
    PlaidTransaction.belongsTo(models.PlaidAccount, {
      foreignKey: 'accountId',
      targetKey:'accountId'
    });
  };
  return PlaidTransaction;
};