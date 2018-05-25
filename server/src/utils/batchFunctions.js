export const customerBatcher = async (customerIds, models, user) => { 
  const results = await models.Customer.findAll({ where: {id: {[models.sequelize.Op.in]: customerIds} } }, { raw: true })

  return results
}