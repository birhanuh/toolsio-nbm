'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'tasks', schema: 'testa' }, [{
      name: 'Task1',
      hours: '20',
      payment_type: 'per task',
      unit_price: 30,
      total: 600,
      project_id: 13,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Task2',
      hours: '15',
      payment_type: 'per task',
      unit_price: 15,
      total: 225,
      project_id: 13,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Task3',
      hours: '10',
      payment_type: 'per task',
      unit_price: 20,
      total: 200,
      project_id: 13,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'tasks', schema: 'testa' }, null)
  }
}