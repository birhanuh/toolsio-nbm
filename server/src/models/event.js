export default (sequelize, DataTypes) => {
  const Event = sequelize.define('events', {
    title: {
      allowNull : false,
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE
    },
    end: {
      type: DataTypes.DATE
    }
  })

  Event.associate = (models) => {
    // 1:M
    Event.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      },
      constraints: false
    })
  }
  return Event
}

