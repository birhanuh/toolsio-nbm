'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('customers', [{
      name: 'customera',
      vat_number: 12341,
      phone_number: 12345678910,
      is_contact_included_in_invoice: false,
      street: 'Street 1',
      postal_code: '1234',
      region: 'Test',
      country: 'Test',
      user_id: 1,
      created_at : new Date(),
      updated_at : new Date()
    },{
      name: 'customerb',
      vat_number: 12342,
      phone_number: 22345678910,
      is_contact_included_in_invoice: false,
      street: 'Street 1',
      postal_code: '1234',
      region: 'Test',
      country: 'Test',
      user_id: 2,
      created_at : new Date(),
      updated_at : new Date()
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('customers', null, {})
  }
}
