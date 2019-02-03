import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY}>
    {({ loading, error, data }) => {

      if (loading) return null;
      if (error) return `Error!: ${error}`;
      
      const { getCurrentAccount } = data
      //console.log('get: ', getCurrentAccount)
      return (<Route {...rest} render={props => (    
        getCurrentAccount ? (<Component {...props} currentAccount={getCurrentAccount} />) : 
          (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
        }/>)  
    }}
  </Query>
)

