'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlaidAccounts', {
      id: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING
      },
      accountId: {
        type: Sequelize.STRING
      },
      itemId: {
        type: Sequelize.STRING
      },
      balanceAvailable: Sequelize.FLOAT,
      balanceCurrent: Sequelize.FLOAT,
      balanceLimit: Sequelize.FLOAT,
      isoCurrencyCode: Sequelize.STRING,
      unofficialCurrencyCode: Sequelize.STRING,
      lastUpdatedDateTime: Sequelize.DATE,
      mask: Sequelize.STRING,
      name: Sequelize.STRING,
      officialName: Sequelize.STRING,
      type: Sequelize.STRING,
      subtype: Sequelize.STRING,
      verificationStatus: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PlaidAccounts');
  }
};