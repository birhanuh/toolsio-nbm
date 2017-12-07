import axios from 'axios'
import { SET_INVOICES, ADD_INVOICE, INVOICE_FETCHED, INVOICE_UPDATED, INVOICE_DELETED } from './types'

export function setInvoices(invoices) {
  return {
    type: SET_INVOICES,
    invoices
  }
}

export function addInvoice(invoice) {
  return {
    type: ADD_INVOICE,
    invoice
  }
}

export function invoiceFetched(invoice) {
  return {
    type: INVOICE_FETCHED,
    invoice
  }
}

export function invoiceUpdated(invoice) {
  return {
    type: INVOICE_UPDATED,
    invoice
  }
}

export function invoiceDeleted(id) {
  return {
    type: INVOICE_DELETED,
    id
  }  
}

export function createInvoice(invoice) {
  return dispatch => {
    return axios.post('/api/invoices', invoice)
      .then(res => {
        dispatch(addInvoice(res.data.result))
      })
  }
}

export function fetchInvoices() {
  return dispatch => {
    return axios.get('/api/invoices')
      .then(res => {
        dispatch(setInvoices(res.data.results))
      })
  }
}

export function fetchInvoice(id) {
  return dispatch => {
    return axios.get(`/api/invoices/${id}`)
      .then(res => {
        dispatch(invoiceFetched(res.data.result))
      })
  }
}

export function updateInvoice(invoice) {
  return dispatch => {
    return axios.put(`/api/invoices/${invoice._id}`, invoice)
      .then(res => {
        dispatch(invoiceUpdated(res.data.result))
      })
  }
}

export function deleteInvoice(id) {
  return dispatch => {
    return axios.delete(`/api/invoices/${id}`)
      .then(res => {
        dispatch(invoiceDeleted(id))
      })    
  }
}
