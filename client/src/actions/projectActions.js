import axios from 'axios'
import { SET_PROJECTS, ADD_PROJECT, PROJECT_FETCHED, PROJECT_UPDATED, PROJECT_DELETED } from './types'

export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
  }
}

export function addProject(project) {
  return {
    type: ADD_PROJECT,
    project
  }
}

export function projectFetched(project) {
  return {
    type: PROJECT_FETCHED,
    project
  }
}

export function projectUpdated(project) {
  return {
    type: PROJECT_UPDATED,
    project
  }
}

export function projectDeleted(id) {
  return {
    type: PROJECT_DELETED,
    id
  }
}

export function createProject(project) {
  return dispatch => {
    return axios.post('/api/projects', project).then(res => { 
      dispatch(addProject(res.data.result)) 
    })
  }
}

export function updateProject(project) {
  return dispatch => {
    return axios.put(`/api/projects/${project._id}`, project).then(res => { 
      dispatch(projectUpdated(res.data.result)) 
    })
  }
}

export function deleteProject(id) {
  return dispatch => {
    return axios.delete(`/api/projects/${id}`).then(res => { 
      dispatch(projectDeleted(id)) 
    })
  }
}

export function fetchProjects() {
  return dispatch => {
    return axios.get('/api/projects').then(res => {
      dispatch(setProjects(res.data.results))
    })
  }
}

export function fetchProject(id) {
  return dispatch => {
    return axios.get(`/api/projects/${id}`).then(res => {
      dispatch(projectFetched(res.data.result))
    })
  }
}