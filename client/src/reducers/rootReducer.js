import { combineReducers } from 'redux'
import flashMessage from './flashMessage'
import authentication from './authentication'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessage,
  authentication
})
