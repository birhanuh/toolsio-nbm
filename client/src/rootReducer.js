import { combineReducers } from 'redux'
import flashMessages from './reducers/flashMessages'
import auth from './reducers/auth'
import sales from './reducers/sales'
import projects from './reducers/projects'
import customers from './reducers/customers'
import tasks from './reducers/tasks'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessages,
  auth,
  sales,
  projects,
  customers,
  tasks
})
