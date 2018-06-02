'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('users', [{
      first_name: 'Testa',
      last_name: 'Testa',
      email: 'testa@toolsio.com',
      password: 'ppppp',
      created_at : new Date(),
      updated_at : new Date()
    },{
      first_name: 'Testb',
      last_name: 'Testb',
      email: 'testb@toolsio.com',
      password: 'ppppp',
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
