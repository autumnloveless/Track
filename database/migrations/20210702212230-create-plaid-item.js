'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlaidItems', {
      id: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      },
      itemId: {
        type: Sequelize.STRING
      },
      statusTransactionsLastSuccessfulUpdate: Sequelize.DATE,
      statusTransactionsLastFailedUpdate: Sequelize.DATE,
      statusInvestmentsLastSuccessfulUpdate: Sequelize.DATE,
      statusInvestmentsLastFailedUpdate: Sequelize.DATE,
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
    return queryInterface.dropTable('PlaidItems');
  }
};