import { combineReducers } from 'redux'
import flashMessage from './flashMessage'
import projects from './projects'

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  flashMessage,
  projects
})
