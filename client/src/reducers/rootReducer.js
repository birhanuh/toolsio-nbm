import { combineReducers } from 'redux'
import flashMessage from './flashMessage'
import authentication from './authentication'
import sales from './sales'
import projects from './projects'
import customers from './customers'
import invoices from './invoices'
import conversations from './conversations'
import dashboard from './dashboard'
import account from './account'
import users from './users'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessage,
  authentication,
  sales,
  projects,
  customers,
  invoices,
  conversations,
  dashboard,
  account,
  users
})
