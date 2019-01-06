import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { setCurrentAccount } from '../../actions/authenticationAction'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'

// Localization 
import T from 'i18n-react'

const LOGOUT_MUTATAION = gql`
  mutation {
    logoutUser
  }
`

class Logout extends React.Component {
  componentDidMount = async () => {
    const { client } = this.props
    await client.mutate({
      mutation: LOGOUT_MUTATAION
    })
    client.resetStore()

    // Set authentication to default 
    this.props.setCurrentAccount({})

    this.props.addFlashMessage({
      type: 'success',
      text: T.translate("log_in.flash.logout_success")
    })  
  }

  render() {
    return <Redirect to='/login' />
  }
}

Logout.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
  setCurrentAccount: PropTypes.func.isRequired
}

export default connect(null, { addFlashMessage, setCurrentAccount } ) (withApollo(Logout))