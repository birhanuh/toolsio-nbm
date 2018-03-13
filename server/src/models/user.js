export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false
    },
    avatar_url: DataTypes.STRING,
    is_confirmed: DataTypes.BOOLEAN,
    is_admin: DataTypes.BOOLEAN
  }, {underscored: true})

  User.associate = (models) => {
    // M:M
    User.belongsToMany(models.Conversation, {
      through: 'participants',
      foreignKey: {
        name: 'conversationId',
        field: 'conversation_id'
      }
    })
  }

  return User
}