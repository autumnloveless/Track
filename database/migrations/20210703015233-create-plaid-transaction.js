'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlaidTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      accountId: {
        type: Sequelize.STRING
      },
      userId: Sequelize.STRING,
      transactionId: Sequelize.STRING,
      accountId: Sequelize.STRING,
      amount: Sequelize.NUMBER,
      isoCurrencyCode: Sequelize.STRING,
      unofficialCurrencyCode: Sequelize.STRING,
      category: Sequelize.STRING,
      categoryId: Sequelize.STRING,
      date: Sequelize.DATE,
      authorizedDate: Sequelize.DATE,
      locationId: Sequelize.STRING,
      name: Sequelize.STRING,
      merchantName: Sequelize.STRING,
      paymentMetaId: Sequelize.STRING,
      paymentChannel: Sequelize.STRING,
      pending: Sequelize.BOOLEAN,
      pendingTransactionId: Sequelize.STRING,
      accountOwner: Sequelize.STRING,
      transactionCode: Sequelize.STRING,
      transactionType: Sequelize.STRING,
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
    return queryInterface.dropTable('PlaidTransactions');
  }
};