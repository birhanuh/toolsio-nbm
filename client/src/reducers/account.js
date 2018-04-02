import { ACCOUNT_FETCHED, ACCOUNT_UPDATED } from '../actions/types'

export default function account(state = {}, action = {}) {
  
  switch(action.type) {

    case ACCOUNT_FETCHED:
      return action.account
    
    case ACCOUNT_UPDATED:
      if (state._id === action.account._id) return action.account
      break
    
    default: return state
  }
}