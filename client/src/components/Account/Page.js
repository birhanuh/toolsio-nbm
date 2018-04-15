import React, { Component } from 'react'
import decode from 'jwt-decode'
import { Authorization } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import AccountForm from './AccountForm'
import UserForm from './UserForm'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    
    // Parse subdomain 
    let subdomain =  Authorization.getSubdomain()


  }

  render() {
    
    // Parse subdomain 
    // let subdomain =  Authorization.getSubdomain()
    let subdomain = 'testa'

    let currentAccount
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user, account } = decode(authToken)

      //currentAccount.subdomain = account.subdomain
      currentAccount.firstName = user.firstName
      currentAccount.email = user.email

    } catch(err) {
      console.log('err: ', err)
    }
    
    return (
      <div className="ui stackable grid account">  

        <Breadcrumb />

          <AccountForm subdomain={subdomain} /> 
             
          { currentAccount && <UserForm id={currentAccount.id} /> }

      </div>  
    )
  }
}


const deleteAccountMutation = gql`
  mutation deleteAccount($subdomain: String!) {
    deleteAccount(subdomain: $subdomain) {
      success
      errors {
        path
        message
      }
    }
  }
`

export default graphql(deleteAccountMutation, {
  options: (props) => ({
    variables: {
      subdomain: 'testa'
    },
  })
})(Page)


