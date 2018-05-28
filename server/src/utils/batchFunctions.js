export const customerBatcher = async (customerIds, models) => {
  const results = await models.Customer.findAll({ where: {id: {[models.sequelize.Op.in]: customerIds} } }, { raw: true })

  const data = {}

  // group by id
  results.forEach((r) => {
    data[r.id] = r
  })
  
  return customerIds.map(id => data[id])
}

export const projectBatcher = async (projectIds, models) => {
  const results = await models.Project.findAll({ where: {id: {[models.sequelize.Op.in]: projectIds} } }, { raw: true })

  const data = {}

  // group by id
  results.forEach((r) => {
    data[r.id] = r
  })
  
  return projectIds.map(id => data[id])
}

export const saleBatcher = (saleIds, models) => 
  models.Sale.findAll({ where: {id: {[models.sequelize.Op.in]: saleIds} } }, { raw: true })


export const usersCountLoaderBatcher = async (ids, models) => {
  const results = await models.User.findAll({ 
    include: [
      {
        model: models.Channel,
        where: { id: {[models.sequelize.Op.in]: ids} }
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
