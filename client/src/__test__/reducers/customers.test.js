import reducer from '../../reducers/customers'
import * as types from '../../actions/types'

// Factories
import { Customers, Customer, Customer2 } from '../factories'

describe("customer reducer", function() { 

  it('should handle ADD_CUSTOMER', () => {

    expect(
      reducer([Customer], {
        type: types.ADD_CUSTOMER,
        customer: Customer2
      })
    ).toEqual([
      Customer,
      Customer2
    ])
  })  

  it('should handle SET_CUSTOMERS', () => {

    expect(
      reducer([], {
        type: types.SET_CUSTOMERS,
        customers: Customers
      })
    ).toEqual(
      Customers
    )
  }) 
  
  it('should handle CUSTOMER_UPDATED', () => {

    const customerUpdated = { _id: 1, name: 'Customer 1 updated', vatNumber: '1234',
      contact: { phoneNumber: '12345678910' }, includeContactOnInvoice: false,
      projects: [], customers: [], invoices: [],
      address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' } }

    expect(
      reducer([Customer], {
        type: types.CUSTOMER_UPDATED,
        customer: customerUpdated
      })
    ).toEqual([
      customerUpdated
    ])
  }) 

  it('should handle CUSTOMER_FETCHED', () => {

    expect(
      reducer(Customers, {
        type: types.CUSTOMER_FETCHED,
        customer: Customer
      })
    ).toEqual(
      Customers
    )
  }) 

  it('should handle CUSTOMER_DELETED', () => {
  
    expect(
      reducer(Customers, {
        type: types.CUSTOMER_DELETED,
        customerId: Customer._id
      })
    ).toEqual([
      Customer2
    ])
  }) 

})
