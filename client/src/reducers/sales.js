import { SET_SALES, ADD_SALE, SALE_FETCHED } from '../actions/types'

export default function sales(state = [], action = {}) {
  switch(action.type) {
    case ADD_SALE:
      return [
        ...state, 
        action.sale
      ]
      
    case SALE_FETCHED: 
      const index = state.findIndex(item => item.id === action.sale._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.sale._id) return action.sale
          return item
        })
      } else {
        return [
          ...state,
          action.sale
        ]
      }

    case SET_SALES:
      return action.sales
    default: return state
  }
}