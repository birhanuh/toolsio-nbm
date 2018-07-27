import React, { Component } from 'react'
import decode from 'jwt-decode'
import { graphql } from 'react-apollo'
import { GET_INVITED_USERS_QUERY } from '../../graphql/users'

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

    const { data: { getInvitedUsers } } = this.props

    return (
      <div className="row column">  
        <div className="ui text container"> 
        
          <FormPage />  

          { getInvitedUsers && <List users={getInvitedUsers} /> }

        </div>
      </div>  
    )
  }
}

export default graphql(GET_INVITED_USERS_QUERY)(Page)
