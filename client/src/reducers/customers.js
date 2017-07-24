import { SET_CUSTOMERS, ADD_CUSTOMER, CUSTOMER_FETCHED, CUSTOMER_UPDATED, CUSTOMER_DELETED } from '../actions/types'

export default function customers(state = [], action = {}) {
  switch(action.type) {

    case SET_CUSTOMERS:
      return action.customers

    default: return state
  }
}