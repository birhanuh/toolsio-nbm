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
  Message: sequelize.import('./conversation/message'),
  Channel: sequelize.import('./conversation/channel'),
  Member: sequelize.import('./conversation/member'),
  DirectMessage: sequelize.import('./conversation/directMessage')
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models
