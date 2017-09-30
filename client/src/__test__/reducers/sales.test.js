import reducer from '../../reducers/sales'
import * as types from '../../actions/types'

// Sale store mocks
const sale = {
  _id: 1,
  name: 'Sale 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 1 description...' 
}

const sales = [{
  _id: 1,
  name: 'Sale 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 1 description...' 
},
{
  _id: 2,
  name: 'Sale 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 2 description...' 
}]

describe("sale reducer", function() { 

  it('should handle ADD_SALE', () => {

    expect(
      reducer([sale], {
        type: types.ADD_SALE,
        sale: sale
      })
    ).toEqual([
      {
        _id: 1,
        name: 'Sale 1',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Sale 1 description...' 
      },
      sale
    ])
  })  

  it('should handle SET_SALES', () => {

    expect(
      reducer([], {
        type: types.SET_SALES,
        sales: sales
      })
    ).toEqual(
      sales
    )
  }) 
  
  it('should handle SALE_UPDATED', () => {

    const saleUpdated = { _id: 1, name: 'Sale 1 updated', deadline: new Date().toDateString(),
            status: 'new', description: 'Sale 1 description updated...'  }

    expect(
      reducer([sale], {
        type: types.SALE_UPDATED,
        sale: saleUpdated
      })
    ).toEqual([
      saleUpdated
    ])
  }) 

  it('should handle SALE_FETCHED', () => {

    expect(
      reducer(sales, {
        type: types.SALE_FETCHED,
        sale: sale
      })
    ).toEqual([
      {
        _id: 1,
        name: 'Sale 1',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Sale 1 description...' 
      },
      {
        _id: 2,
        name: 'Sale 2',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Sale 2 description...' 
      }
    ])
  }) 

  it('should handle SALE_DELETED', () => {
  
    expect(
      reducer(sales, {
        type: types.SALE_DELETED,
        saleId: sale._id
      })
    ).toEqual([
      {
        _id: 2,
        name: 'Sale 2',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Sale 2 description...' 
      }
    ])
  }) 

})
