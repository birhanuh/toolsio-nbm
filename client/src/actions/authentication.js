import axios from 'axios'
import { setAuthorizationToken } from '../utils'
import jwtDecode from 'jwt-decode'
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

export function loginRequest(data) {
  return dispatch => {
    return axios.post('/users/login', data).then(res => {
      const token = res.data.token
      
      localStorage.setItem('user', JSON.stringify(res.data))
      dispatch(setCurrentUser(res.data))
    })
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('user')
    dispatch(setCurrentUser({}))
    return axios.post('/users/logout')
  }
}