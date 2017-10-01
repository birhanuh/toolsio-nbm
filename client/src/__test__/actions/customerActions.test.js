import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Actions 
import { 
  fetchCustomers, addCustomer, setCustomers, CustomerFetched, customerUpdated, customerDeleted
} from '../../actions/customerActions'
import * as types from '../../actions/types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("actoins", () => { 

  test('should create an action to add a Customer', () => {
    const customer = {}
    const expectedAction = {
      type: types.ADD_CUSTOMER,
      customer
    }
    expect(addCustomer(customer)).toEqual(expectedAction)
  })  

  test('should create an action to set Customers', () => {
    const customers = []
    const expectedAction = {
      type: types.SET_CUSTOMERS,
      customers
    }
    expect(setCustomers(customers)).toEqual(expectedAction)
  })  

  test('should create an action to update a Customer', () => {
    const customer = {}
    const expectedAction = {
      type: types.CUSTOMER_UPDATED,
      customer
    }
    expect(customerUpdated(customer)).toEqual(expectedAction)
  })  

  // Async Action Creator
  it('should excute fetchCustomers()', () => {
    
    const store = mockStore({})

    // Return the promise
    return store.dispatch(fetchCustomers())
      .then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual(setCustomers())
      })
  })
  
})
