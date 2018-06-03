import Sequelize from 'sequelize'

const env = process.env.NODE_ENV
const config = require(__dirname + '/../../config/config.json')[env]

const sequelize = new Sequelize(config)

const models = {
  Account: sequelize.import('./account'),
  User: sequelize.import('./user'),
  Customer: sequelize.import('./customer'),
  Project: sequelize.import('./project'),
  Task: sequelize.import('./task'),
  Sale: sequelize.import('./sale'),
  Item: sequelize.import('./item'),
  Invoice: sequelize.import('./invoice'),
  ChannelMessage: sequelize.import('./conversation/channelMessage'),
  DirectMessage: sequelize.import('./conversation/directMessage'),
  Channel: sequelize.import('./conversation/channel'),
  Member: sequelize.import('./conversation/member')
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize;

export default models
