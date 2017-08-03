import { SET_PROJECTS, ADD_PROJECT, PROJECT_FETCHED, PROJECT_UPDATED, PROJECT_DELETED } from '../actions/types'

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
      return state.filter(item => item._id !== action.projectId)
    
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
      
    default: return state
  }
}