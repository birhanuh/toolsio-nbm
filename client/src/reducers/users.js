import { SET_USERS, USER_FETCHED, USER_UPDATED } from '../actions/types'

export default function conversations(state = [], action = {}) {
  
  switch(action.type) {

    case SET_USERS:
      return action.users

    case USER_UPDATED:
      return state.map(item => {
        if (item._id === action.user._id) return action.user
        return item
      })

    case USER_FETCHED: 
      const index = state.findIndex(item => item._id === action.user._id)
    
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.user._id) return action.user
          return item
        })
      } else {
        return [
          ...state,
          action.user
        ]
      }

    default: return state
  }
}