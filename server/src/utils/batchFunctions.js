export const customerBatcher = async (customerIds, models, subdomain) => {
  const results = await models.Customer.findAll({ where: {id: {[models.sequelize.Op.in]: customerIds} }, searchPath: subdomain }, { raw: true })

  const data = {}

  // group by id
  results.forEach((r) => {
    data[r.id] = r
  })
  
  return customerIds.map(id => data[id])
}

export const projectBatcher = async (projectIds, models, subdomain) => {
  const results = await models.Project.findAll({ where: {id: {[models.sequelize.Op.in]: projectIds} }, searchPath: subdomain }, { raw: true })

  const data = {}

  // group by id
  results.forEach((r) => {
    data[r.id] = r
  })
  
  return projectIds.map(id => data[id])
}

export const saleBatcher = async (saleIds, models, subdomain) => {
  const results = await models.Sale.findAll({ where: {id: {[models.sequelize.Op.in]: saleIds} }, searchPath: subdomain }, { raw: true })

  const data = {}

  // group by id
  results.forEach((r) => {
    data[r.id] = r
  })
  
  return saleIds.map(id => data[id])
}

export const userBatcher = async (userId, models, subdomain) => {
  const result = await models.User.findOne({ where: {id: userId}, searchPath: subdomain }, { raw: true })

  return [result]
}

export const usersCountLoaderBatcher = async (ids, models, subdomain) => {
  const results = await models.User.findAll({ 
    include: [
      {
        model: models.Channel,
        where: { id: {[models.sequelize.Op.in]: ids} }, 
        searchPath: subdomain
      }
    ]}, { raw: true })

  const data = {}
  console.log('results ', results[0].dataValues.channels)
  // group by channel
  results.forEach((r) => {
    if (data[r.id]) {
      data[r.id].push(r)
    } else {
      data[r.id] = [r]
    }
  })
  console.log('data ', data)
  // [[{name: 'general'}], [], []]
  return results
}
