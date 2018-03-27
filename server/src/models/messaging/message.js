export default (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    title: {
      type: DataTypes.STRING,
      allowNull : false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull : false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      field: 'is_read'
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      field: 'is_archived'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  }, {underscored: true})

  Message.associate = (models) => {
    // 1:N
    Message.belongsToMany(models.User, {
      through: models.Conversation,
      foreignKey: {
        name: 'messageId',
        field: 'message_id'
      }
    })

    Message.belongsTo(models.User, {
      foreignKey: 'author'
    })
  }

  return Message
}


