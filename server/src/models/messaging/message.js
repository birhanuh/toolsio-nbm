export default (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    title: DataTypes.STRING,
    body: {
      type: DataTypes.STRING,
      allowNull : false
    },
    is_read: DataTypes.BOOLEAN,
    is_drafted: DataTypes.BOOLEAN
  }, {underscored: true})

  Message.associate = (models) => {
    // 1:M
    Message.belongsTo(models.Conversation, {
      foreignKey: {
        name: 'conversationId',
        field: 'conversation_id'
      }
    })

    Message.belongsTo(models.User, {
      foreignKey: 'author'
    })
  }

  return Message
}


