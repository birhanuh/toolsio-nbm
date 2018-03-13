import Sequelize from 'sequelize'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]

const sequelize = new Sequelize(config.database, config.username, config.password, config)

const models = {
  Account: sequelize.import('./account'),
  User: sequelize.import('./user'),
  Customer: sequelize.import('./customer'),
  Project: sequelize.import('./project'),
  Task: sequelize.import('./task'),
  Sale: sequelize.import('./sale'),
  Item: sequelize.import('./item'),
  Invoice: sequelize.import('./invoice'),
  Message: sequelize.import('./messaging/message'),
  Conversation: sequelize.import('./messaging/conversation')
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models
