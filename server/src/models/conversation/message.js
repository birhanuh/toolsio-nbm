export default (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    message: DataTypes.TEXT,
    path: DataTypes.STRING,
    type: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      field: 'is_read'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  })

  Message.associate = (models) => {
    // 1:M
    Message.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    })

    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    })
  }

  return Message
}


