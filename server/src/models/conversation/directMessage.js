export default (sequelize, DataTypes) => {
  var directMessage = sequelize.define('direct_messages', {
    message: {
      type: DataTypes.TEXT,
      allowNull : false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      field: 'is_read'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  }, {})
  directMessage.associate = function(models) {
     // 1:M
    directMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      }
    })

    directMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      }
    })
  };
  return directMessage
};