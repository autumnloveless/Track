'use strict';
module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define('Queue', {
    requester_number: DataTypes.STRING,
    status:{
      type: DataTypes.ENUM,
      values: ['new', 'pending', 'paired']
    }
  }, {});
  Queue.associate = function(models) {
    Queue.belongsTo(models.User, {
      foreignKey: 'requester_number',
      as: 'requester',
      onDelete: 'CASCADE',
    });
  };
  return Queue;
};