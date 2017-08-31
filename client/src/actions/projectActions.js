import axios from 'axios'
import { ADD_PROJECT, SET_PROJECTS, PROJECT_FETCHED, PROJECT_UPDATED, PROJECT_DELETED, ADD_TASK, TASK_UPDATED, TASK_DELETED } from './types'

export function addProject(project) {
  return {
    type: ADD_PROJECT,
    project
  }
}

export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
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

export function addTask(task) {
  return {
    type: ADD_TASK,
    task  
  }
}

export function taskUpdated(task) {
  return {
    type: TASK_UPDATED,
    task
  }
}

export function taskDeleted(task) {
  return {
    type: TASK_DELETED,
    task
  }
}

export function createProject(project) {
  return dispatch => {
    return axios.post('/api/projects', project).then(res => { 
      dispatch(addProject(res.data.result)) 
    })
  }
}

export function fetchProjects() {
  return dispatch => {
    return axios.get('/api/projects').then(res => {
      console.log('res: ', res)
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

export function createTask(task) {
  return dispatch => {
    return axios.post('/api/tasks', task).then(res => {
      dispatch(addTask(res.data.result))
    })
  }
}

export function updateTask(task) {
  return dispatch => {
    return axios.put(`/api/tasks/${task._id}`, task).then(res => {
      dispatch(taskUpdated(res.data.result))
    })
  }
  
}

export function deleteTask(task) {
  return dispatch => {
    return axios.delete(`/api/tasks/${task._id}`).then(res => {
      dispatch(taskDeleted(task))
    })
  }
}

