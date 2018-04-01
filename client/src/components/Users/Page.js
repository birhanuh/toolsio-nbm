import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { decode } from 'jwt-decode'
import List from './List' 
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Breadcrumb from '../Layouts/Breadcrumb'
import Form from './Form'

class Page extends Component {

  componentDidMount() {
   
  }

  render() {

    const { getUsers } = this.props.data

    let currentAccount
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user, account } = decode('authToken')

      currentAccount.subdomain = account.subdomain
      currentAccount.firstName = user.firstName
      currentAccount.email = user.email

    } catch(err) {
      console.log('err: ', err)
    }

    let usersNotCurrentUserIncluded = getUsers && getUsers.filter(user => user.email !== currentAccount.email)
    
    return (
      <div className="row column">  

        <Breadcrumb />

        <div className="ui text container"> 
        
          <Form />  

          <List users={usersNotCurrentUserIncluded} />   

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
