import { SET_SALES } from '../actions/types'

export default function lists(state = [], action = {}) => {
  switch(action.type) {
    case SET_SALES:
      return action.sales
    default: return state
  }
}