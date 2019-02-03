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
    return ''
  } 
}

export const isAuthPages = () => {
  let authPages = window.location.pathname.indexOf('/login') === 0 || window.location.pathname.indexOf('/signup') === 0
      || window.location.pathname.indexOf('/subdomain') === 0 ? true : false

  return authPages
}

/**
 * Get a cookie
 * @param {String} cname, cookie name
 * @return {String} String, cookie value 
 */
export const getCookie = (cname) => {
  var name = cname + "="; //Create the cookie name variable with cookie name concatenate with = sign
  var cArr = window.document.cookie.split(';'); //Create cookie array by split the cookie by ';'
   
  //Loop through the cookies and return the cooki value if it find the cookie name
  for(var i=0; i<cArr.length; i++) {
      var c = cArr[i].trim();
      //If the name is the cookie string at position 0, we found the cookie and return the cookie value
      if (c.indexOf(name) == 0) 
          return c.substring(name.length, c.length);
  }
   
  //If we get to this point, that means the cookie wasn't find in the look, we return an empty string.
  return "";
}

/**
 * Delete a cookie
 * @param {String} cname, cookie name
 */
export const deleteCookie = (cname) => {
  var d = new Date(); //Create an date object
  d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
  var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
  window.document.cookie = cname+"="+"; "+expires;//Set the cookie with name and the expiration date
}

export const isAuthenticated = () => {
  const currentAccount = getCookie('currentAccount') && JSON.parse(getCookie('currentAccount'))
  
  if (currentAccount) {
      return true
  } else {
    return false 
  }

}
