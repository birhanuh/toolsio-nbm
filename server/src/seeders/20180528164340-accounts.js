'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('accounts', [{
      subdomain: 'testa',
      industry: 'testa',
      owner: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      subdomain: 'testb',
      industry: 'testb',
      owner: 2,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('accounts', null, {})
  }
}
