import saleReducer from '../../reducers/sales'
import { fromJS } from 'immutable'

describe("reducer", function() { 

  test('should return initial state', function() {
    expect(saleReducer(undefined, {})).toEqual(fromJS({
      saleId: '',
      sales: [],
      sale: {},
      item: {}
    }))
    
  })  
  
  test('should have a type of "ADD_SALE"', function() {
    expect(addSale().type).toEqual('ADD_SALE')
  })  

  test('should pass on the sale we pass in', function() {
    const sale = {}
    expect(addSale(sale).sale).toEqual(sale)
  })  

  
})
