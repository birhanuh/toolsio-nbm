import axios from 'axios'

export function createSale(sale) {
  return dispatch => {
    return axios.post('/api/sales', sale)
  }
}