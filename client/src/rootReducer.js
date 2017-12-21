import { combineReducers } from 'redux'
import flashMessages from './reducers/flashMessages'
import authentication from './reducers/authentication'
import sales from './reducers/sales'
import projects from './reducers/projects'
import customers from './reducers/customers'
import invoices from './reducers/invoices'
import conversations from './reducers/conversations'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessages,
  authentication,
  sales,
  projects,
  customers,
  invoices,
  conversations
})
