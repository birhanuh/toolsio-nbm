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

  return Event
}

