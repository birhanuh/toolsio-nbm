import axios from 'axios'
import { SET_SALES } from './types'

export function setSales(sales) {
  return {
    type: SET_SALES,
    sales
  }
}

export function createSale(sale) {
  return dispatch => {
    return axios.post('/api/sales', sale)
  }
}

export function fetchSales() {
  return dispatch => {
    return axios.get('/api/sales')
            .then(res => res.json())
            .then(data => dispatch(setSales(data.sales)))
  }
}