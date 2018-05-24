export default (sequelize, DataTypes) => {
  const channelMessage = sequelize.define('channel_messages', {
    body: DataTypes.TEXT,
    uploadPath: {
      type: DataTypes.STRING,
      field: 'upload_path'
    },
    mimetype: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      field: 'is_read'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  }, {
    indexes: [
      { fields: ['created_at'] }
    ]
  })

  channelMessage.associate = (models) => {
    // 1:M
    channelMessage.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    })

    channelMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    })
  }

  return channelMessage
}


