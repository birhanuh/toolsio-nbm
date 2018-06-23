import React, { Component } from 'react'
import decode from 'jwt-decode'
import { getSubdomain } from '../../utils'

import AccountForm from './AccountForm'
import UserForm from './UserForm'

class Page extends Component {

  render() {
    
    // Parse subdomain 
    let subdomain =  getSubdomain()

    let currentUser
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user } = decode(authToken)

      currentUser = user
      console.log('user ', currentUser)
    } catch(err) {
      console.log('err: ', err)
    }
    
    return (
      <div className="row column"> 
        <div className="twelve wide column">

          <AccountForm subdomain={subdomain} /> 
             
          { currentUser.email && <UserForm email={currentUser.email} /> }
        </div>  
      </div>  
    )
  }
}

export default Page


