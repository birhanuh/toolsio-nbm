import axios from 'axios'
import { SET_PROJECTS, ADD_PROJECT, PROJECT_FETCHED, PROJECT_UPDATED, PROJECT_DELETED } from './types'

export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
  }
}

export function createProject(project) {
  return dispatch => {
    return axios.post('api/projects', project).then(res => {
      dispatch(addProject(res.data.result))
    })
  }
}

export function fetchProjects() {
  return dispatch => {
    return axios.get('api/projects').then(res => {
      dispatch(setProjects(res.data.results))
    })
  }
}