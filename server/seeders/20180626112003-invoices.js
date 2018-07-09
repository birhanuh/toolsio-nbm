'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'invoices', schema: 'testa' }, [{
      reference_number: 12346,
      deadline: new Date(),
      interest_in_arrears: 10,
      description: "Project 1 invoice...",
      customer_id: 1,
      project_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      reference_number: 12345,
      payment_term: 10,
      interest_in_arrears: 20,
      description: "Project 2 invoice...",
      customer_id: 1,
      sale_id: 1,
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'invoices', schema: 'testa' }, null)
  }
}