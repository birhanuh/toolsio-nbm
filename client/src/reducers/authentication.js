import { SET_CURRENT_ACCOUNT } from '../actions/types'
import isEmpty from 'lodash/isEmpty'

const initialState = {
  isAuthenticated: false,
  account: {}
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_ACCOUNT:
      return {
        isAuthenticated: !isEmpty(action.account),
        account: action.account
      }
      
    default: return state
  }
}