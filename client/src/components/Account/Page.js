import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Authorization } from '../../utils'
import { fetchAccount, updateAccount, uploadLogo } from '../../actions/accountActions'
import { updateUser, uploadAvatar } from '../../actions/userActions'
import { addFlashMessage } from '../../actions/flashMessageActions'

import AccountForm from './AccountForm'
import UserForm from './UserForm'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    
    // Parse subdomain 
    let subdomain =  Authorization.getSubdomain()

    // Fetch account
    this.props.fetchAccount(subdomain)
  }

  render() {
    
    return (
      <div className="ui stackable grid">  

        <Breadcrumb />

          <AccountForm account={this.props.account} updateAccount={this.props.updateAccount} uploadLogo={this.props.uploadLogo} addFlashMessage={addFlashMessage}  />
             
          <UserForm user={this.props.user} updateUser={this.props.updateUser} uploadAvatar={this.props.uploadAvatar} addFlashMessage={addFlashMessage}  />

      </div>  
    )
  }
}

Page.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  uploadLogo: PropTypes.func.isRequired,
  updateAvatar: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    account: state.account,
    user: state.authentication.account
  }
}

export default connect(mapSateToProps, { fetchAccount, updateAccount, updateUser })(Page)
