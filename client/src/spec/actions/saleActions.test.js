import { 
  addSale, setSales, saleFetched, saleUpdated, saleDeleted
} from '../../actions/saleActions'
import * as types from '../../actions/types'

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
  
})
