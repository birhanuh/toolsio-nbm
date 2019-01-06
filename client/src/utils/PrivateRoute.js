import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'
import { getSubdomain } from './'

// Authenticated routes
// export const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Query query={GET_CURRENT_ACCOUNT_QUERY}>
//     {({ loading, error, data }) => {

//       {loading && <div>loading...</div>}
      
//       const { getCurrentAccount } = data
//       if (getCurrentAccount) {
//         console.log('Yeah!', getCurrentAccount)
//       }
     
//       return (<Route {...rest} render={props => (    
//         (!error && getCurrentAccount !== null) ? (<Component {...props} currentUser={getCurrentAccount} />) : 
//           (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
//         }/>)
  
//     }}
//   </Query>
// )


import { withApollo } from 'react-apollo'

// Authenticated routes
const PrivateRoute = ({ component: Component, ...rest }) => {

  // const { getCurrentAccount } = rest.mutate({
  //     query: GET_CURRENT_ACCOUNT_QUERY
  //   })

  console.log('getCurrentAccountRequest: ', this.getCurrentAccountRequest())
  // return (<Route {...rest} render={props => ( 
  //   (getCurrentAccountRequest) ? (<Component {...props} currentUser={getCurrentAccount} />) : 
  //     (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
  //   }/>)
  return (<Route {...rest} render={props => ( <Redirect to={{ pathname: '/login', state: {from: props.location}}}/>) }/>)
}

export default withApollo(PrivateRoute)


// /Authenticated routes
// class PrivateRoute extends React.Component {

//   getCurrentAccountRequest = async () => {
//     const { getCurrentAccount } = await this.props.mutate({
//       query: GET_CURRENT_ACCOUNT_QUERY
//     })
//     return getCurrentAccount
//   }   

//   render() {
//     const { Component } = this.props
//     console.log('getCurrentAccountRequest: ', this.getCurrentAccountRequest())
//     return (<Route {...rest} render={props => ( 
//       (this.getCurrentAccountRequest()) ? (<Component {...this.props} currentUser={getCurrentAccount} />) : 
//         (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
//       }/>)
//   }
// }

// export default withApollo(PrivateRoute)

