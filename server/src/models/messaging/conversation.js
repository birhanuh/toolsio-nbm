export default (sequelize, DataTypes) => {
  const Conversation = sequelize.define('conversations', {
 
  })

  Conversation.associate = (models) => {
    // M:M
    Conversation.belongsToMany(models.User, {
      through: 'participants',
      foreignKey: {
        name: 'conversationId',
        field: 'conversation_id'
      }
    })
  }

  return Conversation
}