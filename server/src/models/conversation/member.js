export default (sequelize, DataTypes) => {
  const Member = sequelize.define('members', {
    channelId: {
      type: DataTypes.BOOLEAN,
      field: 'channel_id'
    }
  })

  return Member
}