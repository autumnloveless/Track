'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransactionTags', {
      id: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      tagId: {
        type: Sequelize.DataTypes.UUID
      },
      userId: {
        type: Sequelize.DataTypes.UUID
      },
      plaidTransactionId: {
        type: Sequelize.DataTypes.UUID
      },
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
    return queryInterface.dropTable('TransactionTags');
  }
};