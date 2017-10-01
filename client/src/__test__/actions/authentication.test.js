import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Actions 
import { signupRequest, setCurrentAccount } from '../../actions/authentication'
import * as types from '../../actions/types'

const middlewares = [thunk]
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
    
    const store = mockStore({})

    // Return the promise
    return store.dispatch(signupRequest())
      .then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual(setProjects())
      })
  })
  
})
