import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { getSubdomain, isAuthenticated } from './'

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (    
    isAuthenticated() ? (<section className="ui stackable grid basic segment internal-page"><Component {...props} /></section>) : 
      (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
    }/>)

// Login route
export const SubdomainRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getSubdomain() ? (<section className="ui stackable grid auth-pages"><Component {...props} /></section>) : (<Redirect to={{ pathname: '/', 
      state: {from: props.location}}}/>))  
    }/>
  )



