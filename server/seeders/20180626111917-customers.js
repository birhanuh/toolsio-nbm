'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert({ tableName: 'customers', schema: 'testa' }, [{
      name: 'Customera',
      vat_number: 12341,
      phone_number: '12345678910',
      email: '',
      is_contact_included_in_invoice: false,
      street: 'Street 1',
      postal_code: '1234',
      region: 'Luanda',
      country: 'Angola',
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'Customerb',
      vat_number: 12342,
      phone_number: '12345678910',
      email: '',
      is_contact_included_in_invoice: false,
      street: 'Street 1',
      postal_code: '1234',
      region: 'Luanda',
      country: 'Angola',
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete({ tableName: 'customers', schema: 'testa' }, null)
  }
}
