export default (sequelize, DataTypes) => {
  var directMessage = sequelize.define('direct_messages', {
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

  directMessage.associate = function(models) {
     // 1:M
    directMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      },
      constraints: false
    })

    directMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      },
      constraints: false
    })
  }

  return directMessage
};