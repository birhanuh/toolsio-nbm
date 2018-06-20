import axios from 'axios'
import decode from 'jwt-decode'

export default {
  setInvitationToken: (token) => {
    if (token) {
      axios.defaults.headers.common['Invitation'] = token
    } else {
      delete axios.defaults.headers.common['Invitation'] 
    }
  },

  setSubdomain: (subdomain) => {
    if (subdomain) {
      axios.defaults.headers.common['Subdomain'] = subdomain
    } else {
      delete axios.defaults.headers.common['Subdomain'] 
    }
  },

  getSubdomain: () => {
    // Parse subdomain 
    let subdomain = window.location.hostname

    if (subdomain.split('.').length >= 3) {
      return subdomain.split('.')[0]
    } else {
      return false
    } 
  },

  isAuthenticated: () => {
    const authToken = localStorage.getItem('authToken')
    const refreshAuthToken = localStorage.getItem('refreshAuthToken')
    
    try {
      decode(authToken)
      const { exp } = decode(refreshAuthToken)

      if (Date.now() / 1000 > exp) {
        return false
      }
    } catch(err) {
      return false 
    }

    return true
  }
}

