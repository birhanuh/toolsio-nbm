import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'

import { getSubdomain } from '.'

// Authenticated routes
export const AuthRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY}>
    {({ loading, error, data }) => {

      if (loading) return null;
      if (error) return `Error!: ${error}`;
      
      const { success } = data.getCurrentAccount
      console.log("AuthRoute: ", getSubdomain(), success)
      return (<Route {...rest} render={props => (    
        (success && getSubdomain()) ? (<Redirect to={{ pathname: '/dashboard' }}/>) : 
          (<Component {...props} />))  
        }/>)  
    }}
  </Query>
)