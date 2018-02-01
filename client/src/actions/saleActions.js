import axios from 'axios'
import { ADD_SALE, SET_SALES, SALE_FETCHED, SALE_UPDATED, SALE_DELETED, ADD_ITEM, ITEM_UPDATED, ITEM_DELETED } from './types'

// Action creator
export function addSale(sale) {
  return {
    type: ADD_SALE,
    sale
  }
}

export function setSales(sales) {
  return {
    type: SET_SALES,
    sales
  }
}

export function saleFetched(sale) {
  return {
    type: SALE_FETCHED,
    sale
  }
}

export function saleUpdated(sale) {
  return {
    type: SALE_UPDATED,
    sale
  }
}

export function saleDeleted(id) {
  return {
    type: SALE_DELETED,
    id
  }
}

export function addItem(item) {
  return {
    type: ADD_ITEM,
    item  
  }
}

export function itemUpdated(item) {
  return {
    type: ITEM_UPDATED,
    item
  }
}

export function itemDeleted(item) {
  return {
    type: ITEM_DELETED,
    item
  }
}

// Thunk actions
export function createSale(sale) {
  return dispatch => {
    return axios.post('/api/sales', sale)
      .then(res => { 
        dispatch(addSale(res.data.result)) 
      })
  }
}

export function updateSale(sale) {
  return dispatch => {
    return axios.put(`/api/sales/${sale._id}`, sale)
      .then(res => { 
        dispatch(saleUpdated(res.data.result)) 
      })
  }
}

export function deleteSale(id) {
  return dispatch => {
    return axios.delete(`/api/sales/${id}`)
      .then(res => { 
        dispatch(saleDeleted(id)) 
      })
  }
}

export function fetchSales() {
  return dispatch => {
    return axios.get('/api/sales')
      .then(res => {
        dispatch(setSales(res.data.results))
      })
  }
}

export function fetchSale(id) {
  return dispatch => {
    return axios.get(`/api/sales/${id}`)
      .then(res => {
        dispatch(saleFetched(res.data.result))
      })
  }
}

export function createItem(item) {
  return dispatch => {
    return axios.post('/api/items', item)
      .then(res => {
        dispatch(addItem(res.data.result))
      })
  }
}

export function updateItem(item) {
  return dispatch => {
    return axios.put(`/api/items/${item._id}`, item)
      .then(res => {
        dispatch(itemUpdated(res.data.result))
      })
  }
}

export function deleteItem(item) {
  return dispatch => {
    return axios.delete(`/api/items/${item._id}`)
    .then(res => {
      dispatch(itemDeleted(item))
    })
  }
}