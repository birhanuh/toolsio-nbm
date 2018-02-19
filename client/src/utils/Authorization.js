import axios from 'axios'

export default {
  setAuthorizationToken: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization'] 
    }
  },

  setSubdomain: (subdomain) => {
    if (subdomain) {
      axios.defaults.headers.common['Subdomain'] = subdomain
    } else {
      delete axios.defaults.headers.common['Subdomain'] 
    }
  },

  getSubdomainFromUrl: () => {
    // Parse subdomain 
    let subdomain = window.location.hostname

    if (subdomain.split('.').length >= 3) {
      return subdomain.split('.')[0]
    } else {
      return false
    } 
  }
}