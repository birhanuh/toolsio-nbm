'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'sales', schema: 'testa' }, [{
      name: 'Salea',
      deadline: new Date(),
      description: "Sale 1...",
      customer_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Saleb',
      deadline: new Date(),
      description: "Sale 2...",
      customer_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'sales', schema: 'testa' }, null)
  }
}
