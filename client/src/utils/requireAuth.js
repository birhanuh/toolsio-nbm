import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addFlashMessage } from '../actions/flashMessagesActions'

export default function(ComposedComponent) {

  class Authenticate extends Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.addFlashMessage({
          type: 'error',
          text: 'You need to login to access this page!'
        })
        this.context.router.history.push('/login')
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.context.router.history.push('/')
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }
  }

  Authenticate.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    addFlashMessage: PropTypes.func.isRequired
  }

  Authenticate.contextTypes = {
    router: PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.authentication.isAuthenticated
    }
  }

  return connect(mapStateToProps, {addFlashMessage})(Authenticate)  
}
