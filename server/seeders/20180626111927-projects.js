'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'projects', schema: 'testa' }, [{
      name: 'Projecta',
      deadline: new Date(),
      description: "Project 1...",
      customer_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Projectb',
      deadline: new Date(),
      description: "Project 2...",
      customer_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'projects', schema: 'testa' }, null)
  }
}
