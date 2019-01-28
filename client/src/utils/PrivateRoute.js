import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY}>
    {({ loading, error, data }) => {

      {loading && <div>loading...</div>}
      
      const { getCurrentAccount } = data
     
      return (<Route {...rest} render={props => (    
        (!error && getCurrentAccount !== null) ? (<Component {...props} currentAccount={getCurrentAccount} />) : 
          (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
        }/>)  
    }}
  </Query>
)

/*

import { withApollo } from 'react-apollo'

// Authenticated routes

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log('PROP: ', rest)
  let getCurrentAccountLoc
  const getCurrentAccount = async () => {
    getCurrentAccountLoc = await rest.client.query({
      query: GET_CURRENT_ACCOUNT_QUERY
    }).then(res => res.data.getCurrentAccount)
    return getCurrentAccountLoc
  }
  getCurrentAccount()
  console.log('getCurrentAccount: ', getCurrentAccount())
  console.log('getCurrentAccountLoc: ', getCurrentAccountLoc)
  return (<Route {...rest} render={props => ( 
    true ? (<Component {...props} currentUser={getCurrentAccount} />) : 
      (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
    }/>)
}

export default withApollo(PrivateRoute)

*/
