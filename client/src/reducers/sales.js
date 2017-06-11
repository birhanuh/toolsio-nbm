import { SET_SALES, ADD_SALE, SALE_FETCHED, SALE_UPDATED, SALE_DELETED } from '../actions/types'

export default function sales(state = [], action = {}) {
  switch(action.type) {
    case ADD_SALE:
      return [
        ...state, 
        action.sale
      ]

    case SALE_DELETED:
      return state.filter(item => item._id !== action.saleId)
    
    case SALE_UPDATED:
      return state.map(item => {
        if (item._id === action.sale._id) return action.sale
        return item
      })

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