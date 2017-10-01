import reducer from '../../reducers/sales'
import * as types from '../../actions/types'

// Factories
import { Sales, Sale, Sale2 } from '../factories'

describe("sale reducer", function() { 

  it('should handle ADD_SALE', () => {

    expect(
      reducer([Sale], {
        type: types.ADD_SALE,
        sale: Sale2
      })
    ).toEqual([
      Sale,
      Sale2
    ])
  })  

  it('should handle SET_SALES', () => {

    expect(
      reducer([], {
        type: types.SET_SALES,
        sales: Sales
      })
    ).toEqual(
      Sales
    )
  }) 
  
  it('should handle SALE_UPDATED', () => {

    const saleUpdated = { _id: 1, name: 'Sale 1 updated', deadline: new Date().toDateString(),
            status: 'new', description: 'Sale 1 description updated...'  }

    expect(
      reducer([Sale], {
        type: types.SALE_UPDATED,
        sale: saleUpdated
      })
    ).toEqual([
      saleUpdated
    ])
  }) 

  it('should handle SALE_FETCHED', () => {

    expect(
      reducer(Sales, {
        type: types.SALE_FETCHED,
        sale: Sale
      })
    ).toEqual(
      Sales
    )
  }) 

  it('should handle SALE_DELETED', () => {
  
    expect(
      reducer(Sales, {
        type: types.SALE_DELETED,
        id: Sale._id
      })
    ).toEqual([
      Sale2
    ])
  }) 

})
