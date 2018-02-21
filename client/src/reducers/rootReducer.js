import { combineReducers } from 'redux'
import flashMessages from './flashMessages'
import authentication from './authentication'
import sales from './sales'
import projects from './projects'
import customers from './customers'
import invoices from './invoices'
import conversations from './conversations'
import dashboards from './dashboards'
import users from './users'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessages,
  authentication,
  sales,
  projects,
  customers,
  invoices,
  conversations,
  dashboards,
  users
})
