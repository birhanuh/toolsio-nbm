import models from '../../models'
import map from 'lodash/map'

export async function resetDb() {
  // sync() will create all table if then doesn't exist in database
  await models.sequelize.sync({ force: process.env.NODE_ENV ? 'test' : false,  logging: false })
}

export async function truncate() {
  return await Promise.all(
    map(Object.keys(models), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return models[key].destroy({ where: {}, force: process.env.NODE_ENV ? 'test' : false });
    })
  );
}