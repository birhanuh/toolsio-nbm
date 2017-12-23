import axios from 'axios'
import { SET_USERS } from './types'

export function setUsers(users) {
  return {
    type: SET_USERS,
    users
  }
}

export function fetchUsers() {
  return dispatch => {
    return axios.get('/users/all')
      .then(res => {
        dispatch(setUsers(res.data.results))
      })
  }
}