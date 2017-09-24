import reducer from '../../reducers/auth'
import * as types from '../../actions/types'

describe("auth reducer", () => { 

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        isAuthenticated: false,
        account: {}
      }
    )
    
  })  

  it('should handle SET_CURRENT_ACCOUNT', () => {
    const account = {}
    expect(
      reducer([], {
        type: types.SET_CURRENT_ACCOUNT,
        account: account
      })
    ).toEqual(
      {
        isAuthenticated: false,
        account: {}
      }
    )
  })  

  
})