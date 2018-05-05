import React, { Component } from 'react'
import decode from 'jwt-decode'
import { Authorization } from '../../utils'

import AccountForm from './AccountForm'
import UserForm from './UserForm'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  render() {
    
    // Parse subdomain 
    let subdomain =  Authorization.getSubdomain()

    let currentUser
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user } = decode(authToken)

      currentUser = user
      console.log('user ', currentUser.email)
    } catch(err) {
      console.log('err: ', err)
    }
    
    return (
      <div className="ui stackable grid account">  

        <Breadcrumb />

          <AccountForm subdomain={subdomain} /> 
             
          { currentUser.user && <UserForm email={currentUser.email} /> }

      </div>  
    )
  }
}

export default Page


