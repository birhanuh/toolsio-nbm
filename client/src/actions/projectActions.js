import axios from 'axios'
import { SET_SALES, ADD_SALE, SALE_FETCHED, SALE_UPDATED, SALE_DELETED } from './types'

export function setProjects(projects) {
  return {
    type: SET_GAMES,
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