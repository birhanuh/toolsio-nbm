import axios from 'axios'
//import { setAuthorizationToken } from '../utils'
import { SET_CURRENT_ACCOUNT } from './types'

// Action creators 
export function setCurrentAccount(currentAccount) {
  return {
    type: SET_CURRENT_ACCOUNT,
    currentAccount
  }
}

// Thunk actions
export function signupRequest(accountUser) {
  return dispatch => {
    return axios.post('/users/register', accountUser).then(res => {
      localStorage.setItem('currentAccount', JSON.stringify(res.data))
      dispatch(setCurrentAccount(res.data))
    })
  }
}

export function isSubdomainExist(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
  }
}

export function isUserExist(email) {
  return dispatch => {
    return axios.get(`/users/${email}`)
  }
}

export function loginRequest(data) {
  return dispatch => {
    return axios.post('/users/login', data)
      .then(res => {
        //document.cookie = "_id="+res.data._id+"; firstName="+res.data.firstName+"; lastName="+res.data.firstName+"; email="+res.data.email+""
        localStorage.setItem('currentAccount', JSON.stringify(res.data))
        dispatch(setCurrentAccount(res.data))
      })
  }
}

export function logout() {
  return dispatch => {
    return axios.post('/users/logout')
      .then(() => {        
        localStorage.removeItem('currentAccount')
        dispatch(setCurrentAccount({}))  
      })
  }
}

export function confirmEmail(token) {
  return dispatch => {
    return axios.get(`/users/confirmation/${token}`)  
  }
}


