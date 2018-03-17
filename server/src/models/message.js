export default (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    title: DataTypes.STRING,
    body: {
      type: DataTypes.TEXT,
      allowNull : false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      field: 'is_read'
    },
    isDrafted: {
      type: DataTypes.BOOLEAN,
      field: 'is_drafted'
    }
  }, {underscored: true})

  Message.associate = (models) => {
    // 1:N
    Message.belongsTo(models.User, {
      through: 'participants',
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


