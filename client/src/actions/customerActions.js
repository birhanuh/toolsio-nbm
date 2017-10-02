import axios from 'axios'
import { SET_CUSTOMERS, ADD_CUSTOMER, CUSTOMER_FETCHED, CUSTOMER_UPDATED, CUSTOMER_DELETED } from './types'

export function setCustomers(customers) {
  return {
    type: SET_CUSTOMERS,
    customers
  }
}

export function addCustomer(customer) {
  return {
    type: ADD_CUSTOMER,
    customer
  }
}

export function customerFetched(customer) {
  return {
    type: CUSTOMER_FETCHED,
    customer
  }
}

export function customerUpdated(customer) {
  return {
    type: CUSTOMER_UPDATED,
    customer
  }
}

export function customerDeleted(id) {
  return {
    type: CUSTOMER_DELETED,
    id
  }  
}

export function createCustomer(customer) {
  return dispatch => {
    return axios.post('/api/customers', customer)
      .then(res => {
        dispatch(addCustomer(res.data.result))
      })
  }
}

export function fetchCustomers() {
  return dispatch => {
    return axios.get('/api/customers')
      .then(res => {
        dispatch(setCustomers(res.data.results))
      })
  }
}

export function fetchCustomer(id) {
  return dispatch => {
    return axios.get(`/api/customers/${id}`)
      .then(res => {
        dispatch(customerFetched(res.data.result))
      })
  }
}

export function updateCustomer(customer) {
  return dispatch => {
    return axios.put(`/api/customers/${customer._id}`, customer)
      .then(res => {
        dispatch(customerUpdated(res.data.result))
      })
  }
}

export function deleteCustomer(id) {
  return dispatch => {
    return axios.delete(`/api/customers/${id}`)
      .then(res => {
        dispatch(customerDeleted(id))
      })    
  }
}
