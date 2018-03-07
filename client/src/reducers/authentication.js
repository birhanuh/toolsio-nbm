import { SET_CURRENT_ACCOUNT } from '../actions/types'
import isEmpty from 'lodash/isEmpty'

const initialState = {
  isAuthenticated: false,
  currentAccount: {}
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_ACCOUNT:
      return {
        isAuthenticated: action.currentAccount && !isEmpty(action.currentAccount.email),
        currentAccount: action.currentAccount
      }
      
    default: return state
  }
}