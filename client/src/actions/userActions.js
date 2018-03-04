import axios from 'axios'
import { SET_USERS, USER_UPDATED } from './types'

export function setUsers(users) {
  return {
    type: SET_USERS,
    users
  }
}

export function userUpdated(user) {
  return {
    type: USER_UPDATED,
    user
  }
}

export function fetchUsers() {
  return dispatch => {
    return axios.get('/users/all/users')
      .then(res => {
        dispatch(setUsers(res.data.results))
      })
  }
}

export function sendInvitation(email) {
  return dispatch => {
    return axios.post('/users/account/invitation', email)
  }
}

export function updateUser(user) {
  return dispatch => {
    return axios.post('/users/account/update', user)
  }
}