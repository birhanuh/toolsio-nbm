import React, { Component } from 'react'
import PropTypes from 'prop-types'
import decode from 'jwt-decode'
import List from './List' 
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Breadcrumb from '../Layouts/Breadcrumb'
import Form from './Form'

class Page extends Component {

  componentDidMount() {
   
  }

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

        <Breadcrumb />

        <div className="ui text container"> 
        
          <Form />  

          { usersNotCurrentUserIncluded && <List users={usersNotCurrentUserIncluded} /> }

        </div>
      </div>  
    )
  }
}

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      lastName
      email
    }
}
`

export default graphql(getUsersQuery)(Page)
