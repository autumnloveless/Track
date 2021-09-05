'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionTag = sequelize.define('TransactionTag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plaidTransactionId: DataTypes.UUID,
    tagId: DataTypes.UUID,
    userId: DataTypes.UUID,
  }, {});
  TransactionTag.associate = function(models) {
    TransactionTag.belongsTo(models.Tag, { foreignKey: 'tagId' });
    TransactionTag.belongsTo(models.PlaidTransaction, { foreignKey: 'plaidTransactionId' });
    TransactionTag.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return TransactionTag;
};