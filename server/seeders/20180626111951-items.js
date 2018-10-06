'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'items', schema: 'testa' }, [{
      name: 'Item1',
      unit: 'killo gram',
      quantity: '20',
      unit_price: 3,
      total: 60,
      sale_id: 4,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Item2',
      unit: 'killo gram',
      quantity: '15',
      unit_price: 5,
      total: 75,
      sale_id: 4,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Item3',
      unit: 'meter',
      quantity: '10',
      unit_price: 10,
      total: 100,
      sale_id: 4,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'items', schema: 'testa' }, null)
  }
}