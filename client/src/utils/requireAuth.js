import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { addFlashMessage } from '../actions/flashMessageActions'


// export default function(ComposedComponent) {

//   class Authenticate extends Component {
//     componentWillMount() {
//       if (!this.props.isAuthenticated) {
//         this.props.addFlashMessage({
//           type: 'error',
//           text: 'You need to login to access this page!'
//         })

//         if (Authorization.getSubdomain()) {
//           this.context.router.history.push('/login')
//         } else {
//           this.context.router.history.push('/subdomain')
//         }
//       }
//     }

//     componentWillUpdate(nextProps) {
//       if (!nextProps.isAuthenticated) {
//         this.context.router.history.push('/')
//       }
//     }

//     render() {
//       return (
//         <ComposedComponent {...this.props} />
//       )
//     }
//   }

//   Authenticate.propTypes = {
//     isAuthenticated: PropTypes.bool.isRequired,
//     addFlashMessage: PropTypes.func.isRequired,
//     currentAccount: PropTypes.object.isRequired
//   }

//   Authenticate.contextTypes = {
//     router: PropTypes.object.isRequired
//   }

//   function mapStateToProps(state) {
//     return {
//       isAuthenticated: state.authentication.isAuthenticated,
//       currentAccount: state.authentication.currentAccount
//     }
//   }

//   return connect(mapStateToProps, {addFlashMessage})(Authenticate)  
// }





