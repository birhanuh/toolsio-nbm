import { SET_CUSTOMERS, ADD_CUSTOMER, CUSTOMER_FETCHED, CUSTOMER_UPDATED, CUSTOMER_DELETED } from '../actions/types'

export default function customers(state = [], action = {}) {
  
  switch(action.type) {

    case SET_CUSTOMERS:
      return action.customers

    case ADD_CUSTOMER:
      return [
        ...state, 
        action.customer
      ]

    case CUSTOMER_DELETED:
      return state.filter(item => item._id !== action.id)
    
    case CUSTOMER_UPDATED:
      return state.map(item => {
        if (item._id === action.customer._id) return action.customer
        return item
      })

    case CUSTOMER_FETCHED: 
      const index = state.findIndex(item => item._id === action.customer._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.customer._id) return action.customer
          return item
        })
      } else {
        return [
          ...state,
          action.customer
        ]
      }  

    default: return state
  }
}