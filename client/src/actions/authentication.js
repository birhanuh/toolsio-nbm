import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { setAuthorizationToken } from '../utils'
import { SET_CURRENT_USER } from './types'

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}

export function signupRequest(data) {
  return dispatch => {
    return axios.post('/users/register', data)
  }
}

export function isUserExists(identifier) {
  return dispatch => {
    return axios.get(`/users/${identifier}`)
  }
}

export function subdomainRequest(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
  }
}

export function loginRequest(data) {
  return dispatch => {
    return axios.post('/users/login', data).then(res => {
      localStorage.setItem('user', JSON.stringify(res.data))
      dispatch(setCurrentUser(res.data))
    })
  }
}

export function logout() {
  return dispatch => {
    return axios.post('/users/logout').then(
      () => {        
        localStorage.removeItem('user')
        dispatch(setCurrentUser({}))  
      })
  }
}
