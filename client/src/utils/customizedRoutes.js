import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'
import { getSubdomain } from './'

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY}>
    {({ loading, error, data }) => {

      {loading && <div>loading...</div>}
      
      const { getCurrentAccount } = data
      if (getCurrentAccount) {
        console.log('Yeah!', getCurrentAccount)
      }
     
      return (<Route {...rest} render={props => (    
        (!error && getCurrentAccount !== null) ? (<Component {...props} currentUser={getCurrentAccount} />) : 
          (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
        }/>)
  
    }}
  </Query>
)

// Login route
export const SubdomainRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getSubdomain() ? (<Component {...props} />) : (<Redirect to={{ pathname: '/', 
      state: {from: props.location}}}/>))  
    }/>
  )



