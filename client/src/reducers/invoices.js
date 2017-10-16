import { SET_INVOICES, ADD_INVOICE, INVOICE_FETCHED, INVOICE_UPDATED, INVOICE_DELETED } from '../actions/types'

export default function invoices(state = [], action = {}) {
  switch(action.type) {

    case SET_INVOICES:
      return action.invoices

    case ADD_INVOICE:
      return [
        ...state, 
        action.invoice
      ]

    case INVOICE_DELETED:
      return state.filter(item => item._id !== action.id)
    
    case INVOICE_UPDATED:
      return state.map(item => {
        if (item._id === action.invoice._id) return action.invoice
        return item
      })

    case INVOICE_FETCHED: 
      const index = state.findIndex(item => item._id === action.invoice._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.invoice._id) return action.invoice
          return item
        })
      } else {
        return [
          ...state,
          action.invoice
        ]
      }  

    default: return state
  }
}