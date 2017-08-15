import { ADD_PROJECT, SET_PROJECTS, PROJECT_FETCHED, PROJECT_UPDATED, PROJECT_DELETED, ADD_TASK, TASK_UPDATED, TASK_DELETED } from '../actions/types'

export default function projects(state = [], action = {}) {
  switch(action.type) {    

    case SET_PROJECTS:
      return action.projects
      
    case ADD_PROJECT:
      return [
        ...state, 
        action.project
      ]

    case PROJECT_DELETED:
      return state.filter(item => item._id !== action.id)
    
    case PROJECT_UPDATED:
      return state.map(item => {
        if (item._id === action.project._id) return action.project
        return item
      })

    case PROJECT_FETCHED: 
      const index = state.findIndex(item => item._id === action.project._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.project._id) return action.project
          return item
        })
      } else {
        return [
          ...state,
          action.project
        ]
      }

    case ADD_TASK:
      const creatorIndexAddTask = state.findIndex(item => item._id === action.task._creator)
      if (creatorIndexAddTask > -1) {
        return state.map(item => {
          if (item._id === action.task._creator) {
            return {
              ...item,
              tasks: [...item.tasks, action.task]     
            }  
          }
          return item 
        })
      } else {
        return [...state]
      }

    case TASK_UPDATED:
      const creatorIndexUpdateTask = state.findIndex(item => item._id === action.task._creator)
      if (creatorIndexUpdateTask > -1) {
        return state.map(item => {
          if (item._id === action.task._creator) {
            return {
              ...item,
              tasks: [...item.tasks.filter(taskItem => taskItem._id !== action.task._id), action.task]     
            }  
          }
          return item 
        })
      } else {
        return [...state]
      }

    default: return state
  }
}