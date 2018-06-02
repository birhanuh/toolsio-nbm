'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('projects', [{
      name: 'projecta',
      deadline: new Date(),
      customer_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'projectb',
      deadline: new Date(),
      customer_id: 2,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('projects', null, {})
  }
}
