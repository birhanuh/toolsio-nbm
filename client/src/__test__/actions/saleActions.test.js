import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Actions 
import { 
  fetchSales, addSale, setSales, saleFetched, saleUpdated, saleDeleted, addItem
} from '../../actions/saleActions'
import * as types from '../../actions/types'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

// Factories
import { Sale } from '../factories'

describe("actoins", () => { 

  test('should create an action to add a Sale', () => {
    const sale = {}
    const expectedAction = {
      type: types.ADD_SALE,
      sale
    }
    expect(addSale(sale)).toEqual(expectedAction)
  })  

  test('should create an action to set Sales', () => {
    const sales = []
    const expectedAction = {
      type: types.SET_SALES,
      sales
    }
    expect(setSales(sales)).toEqual(expectedAction)
  })  

  test('should create an action to update a Sale', () => {
    const sale = {}
    const expectedAction = {
      type: types.SALE_UPDATED,
      sale
    }
    expect(saleUpdated(sale)).toEqual(expectedAction)
  })  

  test('should create an action to create an Item', () => {
    const item = {}
    const expectedAction = {
      type: types.ADD_ITEM,
      item
    }
    expect(addItem(item)).toEqual(expectedAction)
  })  

  // Async Action Creator
  xit('should excute fetchSales()', () => {
    
    const store = mockStore({})

    // Return the promise
    return store.dispatch(fetchSales())
      .then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual(setSales(Sale))
      })
  })
  
})
