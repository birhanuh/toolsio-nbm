import axios from 'axios'
import { setAuthorizationToken } from '../utils'
import { SET_CURRENT_ACCOUNT } from './types'

export function setCurrentAccount(account) {
  return {
    type: SET_CURRENT_ACCOUNT,
    account
  }
}

export function signupRequest(accountAndUser) {
  console.log('data: ', accountAndUser)
  return dispatch => {
    return axios.post('/users/register', accountAndUser)
  }
}

export function isAccountExists(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
  }
}

export function subdomainRequest(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`).then(res => {
      localStorage.setItem('account', JSON.stringify(res.data))
      dispatch(setCurrentAccount(res.data))
    })
  }
}

export function isUserExists(email) {
  return dispatch => {
    return axios.get(`/users/${email}`)
  }
}

export function loginRequest(data) {
  return dispatch => {
    return axios.post('/users/login', data).then(res => {
      localStorage.setItem('account', JSON.stringify(res.data))
      dispatch(setCurrentAccount(res.data))
    })
  }
}

export function logout() {
  return dispatch => {
    return axios.post('/users/logout').then(
      () => {        
        localStorage.removeItem('user')
        dispatch(setCurrentAccount({}))  
      })
  }
}
