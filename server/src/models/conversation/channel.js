export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('channels', {
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public'
    }
  })

  Channel.associate = (models) => {
    // N:M
    Channel.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    })

    // 1:N
    Channel.belongsTo(models.User, {
      foreignKey: 'owner'
    })
  }

  return Channel
}
