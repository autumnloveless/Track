'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'PlaidTransactions', // table name
        'tags', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('PlaidTransactions', 'linkedin'),
    ]);
  },
};
