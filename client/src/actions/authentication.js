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
  return dispatch => {
    return axios.post('/users/register', accountAndUser).then(res => {
      localStorage.setItem('account', JSON.stringify(res.data))
      dispatch(setCurrentAccount(res.data))
    })
  }
}

export function isAccountExists(companyName) {
  return dispatch => {
    return axios.get(`/accounts/${companyName}`)
  }
}

export function companyNameRequest(companyName) {
  return dispatch => {
    return axios.get(`/accounts/${companyName}`)
      .then(res => {
        //document.cookie = "firstName="+res.data.firstName+"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/"
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
    return axios.post('/users/login', data)
      .then(res => {
        localStorage.setItem('account', JSON.stringify(res.data))
        dispatch(setCurrentAccount(res.data))
      })
  }
}

export function logout() {
  return dispatch => {
    return axios.post('/users/logout')
      .then(() => {        
        localStorage.removeItem('account')
        dispatch(setCurrentAccount({}))  
      })
  }
}
