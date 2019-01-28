import axios from 'axios'

export const setInvitationToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Invitation'] = token
  } else {
    delete axios.defaults.headers.common['Invitation'] 
  }
}

export const setSubdomain = (subdomain) => {
  if (subdomain) {
    axios.defaults.headers.common['Subdomain'] = subdomain
  } else {
    delete axios.defaults.headers.common['Subdomain'] 
  }
}

export const getSubdomain = () => {
  // Parse subdomain 
  let subdomain = window.location.hostname

  if (subdomain.split('.').length >= 3) {
    return subdomain.split('.')[0]
  } else {
    return false
  } 
}

export const isAuthPages = () => {
  let authPages = window.location.pathname.indexOf('/login') === 0 || window.location.pathname.indexOf('/signup') === 0
      || window.location.pathname.indexOf('/subdomain') === 0 ? true : false

  return authPages
}

