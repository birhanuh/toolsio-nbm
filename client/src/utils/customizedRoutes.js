import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_USER_QUERY } from '../graphql/users'
import { getSubdomain } from './'

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_USER_QUERY}>
    {({ loading, error, data }) => {

      {loading && <div>loading...</div>}
      
      const { getCurrentUser } = data
      if (getCurrentUser) {
        console.log('Yeah!', getCurrentUser)
      }
     
      return (<Route {...rest} render={props => (    
        (!error && getCurrentUser !== null) ? (<Component {...props} currentUser={getCurrentUser} />) : 
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



