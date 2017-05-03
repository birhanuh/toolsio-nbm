import { SET_SALES, ADD_SALE } from '../actions/types'

export default function sales(state = [], action = {}) {
  switch(action.type) {
    case ADD_SALE:
      return [
        ...state, 
        action.sale
      ]
      
    case SET_SALES:
      return action.sales
    default: return state
  }
}