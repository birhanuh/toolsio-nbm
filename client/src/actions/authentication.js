import axios from 'axios'
import { setAuthorizationToken } from '../utils'
import jwtDecode from 'jwt-decode'
import { SET_CURRENT_USER } from './types'

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
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      
      // Decoded toke (i.e. user object)
      let decoded = jwtDecode(token)
      dispatch(setCurrentUser(decoded))
    })
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken')
    setAuthorizationToken(false)
    dispatch(setCurrentUser({}))
  }
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}