'use strict'

module.exports = {
  up: (queryInterface) => {
    // return queryInterface.bulkInsert({ tableName: 'users', schema: 'testa' }, [{
    //   first_name: 'Testd',
    //   last_name: 'Testd',
    //   email: 'testd@toolsio.com',
    //   password: 'ppppp',
    //   created_at : new Date(),
    //   updated_at : new Date()
    // },{
    //   first_name: 'Testf',
    //   last_name: 'Testf',
    //   email: 'testf@toolsio.com',
    //   password: 'ppppp',
    //   created_at : new Date(),
    //   updated_at : new Date()
    // }], {shema: "testa"})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'users', schema: 'testa' }, null)
  }
}
