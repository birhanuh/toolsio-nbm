import axios from 'axios'
import { ACCOUNT_FETCHED, ACCOUNT_UPDATED } from './types'

export function accountFetched(account) {
  return {
    type: ACCOUNT_FETCHED,
    account
  }
}

export function accountUpdated(account) {
  return {
    type: ACCOUNT_UPDATED,
    account
  }
}

export function fetchAccount(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
      .then(res => {
        dispatch(accountFetched(res.data.result))
      })
  }
}

export function updateAccount(account) {
  return dispatch => {
    return axios.put(`/accounts/${account.subdomain}`, account)
      .then(res => { 
        dispatch(accountUpdated(res.data.result)) 
      })
  }
}

export function s3SignLogo(subdomain, variables) {
  return dispatch => {
    return axios.put(`/accounts/logo/${subdomain}`, variables)
  }
}

// Save File to S3
export function uploadLogo(signedRequest, file, options) {
  return dispatch => {
    return axios.put(signedRequest, file, options)
  }
}
