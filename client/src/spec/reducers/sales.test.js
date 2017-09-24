import reducer from '../../reducers/sales'
import * as types from '../../actions/types'

describe("sale reducer", function() { 
  
  it('should handle ADD_SALE', () => {
    const sale = {}

    expect(
      reducer([], {
        type: types.ADD_SALE,
        sale: sale
      })
    ).toEqual([
      sale
    ])
  })  

  
})
