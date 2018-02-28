import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Actions 
import { signupRequest, setCurrentAccount } from '../../actions/authenticationActions'
import * as types from '../../actions/types'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

describe("actoins", () => { 

  test('should create an action to set current Account', () => {
    const account = {}
    const expectedAction = {
      type: types.SET_CURRENT_ACCOUNT,
      account
    }
    expect(setCurrentAccount(account)).toEqual(expectedAction)
  })  

  // Async Action Creator
  it('should excute signupRequest()', () => {
    const account = {}

    const store = mockStore({})

    // Return the promise
    return store.dispatch(signupRequest(account))
      .then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual(setCurrentAccount(account))
      })
  })
  
})
