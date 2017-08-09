import { ADD_TASK, SET_TASKS } from '../actions/types'

export default function projects(state = [], action = {}) {
  switch(action.type) {    

    case SET_TASKS:
      return action.tasks

    case ADD_TASK:
      return [
        ...state,
        action.task
      ]
      
      
    default: return state
  }
}