'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaidItem = sequelize.define('PlaidItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    itemId: DataTypes.STRING,
    statusTransactionsLastSuccessfulUpdate: DataTypes.DATE,
    statusTransactionsLastFailedUpdate: DataTypes.DATE,
    statusInvestmentsLastSuccessfulUpdate: DataTypes.DATE,
    statusInvestmentsLastFailedUpdate: DataTypes.DATE
  }, {});
  PlaidItem.associate = function(models) {
    // associations can be defined here
  };
  return PlaidItem;
};