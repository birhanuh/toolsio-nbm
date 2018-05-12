import React, { Component } from 'react'
import decode from 'jwt-decode'
import { graphql } from 'react-apollo'
import { GET_USERS_QUERY } from '../../graphql/users'

import Breadcrumb from '../Layouts/Breadcrumb'

import List from './List' 
import FormPage from './FormPage'

class Page extends Component {

  render() {
    let currentUser
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user } = decode(authToken)

      currentUser = user

    } catch(err) {
      console.log('err: ', err)
    }

    const { data: { getUsers } } = this.props

    const usersNotCurrentUserIncluded = getUsers && getUsers.filter(user => user.email !== currentUser.email)
    
    return (
      <div className="row column">  
        <div className="ui text container"> 
        
          <FormPage />  

          { usersNotCurrentUserIncluded && <List users={usersNotCurrentUserIncluded} /> }

        </div>
      </div>  
    )
  }
}

export default graphql(GET_USERS_QUERY)(Page)
