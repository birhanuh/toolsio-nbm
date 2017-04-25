import { combineReducers } from 'redux'
import flashMessages from './reducers/flashMessages'
import auth from './reducers/auth'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessages,
  auth
})
