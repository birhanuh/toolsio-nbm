import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Authorization } from '../../utils'
import { fetchAccount, updateAccount, uploadLogo, s3SignLogo } from '../../actions/accountActions'
import { updateUser, uploadAvatar, s3SignAvatar } from '../../actions/userActions'
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

          <AccountForm account={this.props.account} updateAccount={this.props.updateAccount} uploadLogo={this.props.uploadLogo} addFlashMessage={addFlashMessage} s3SignLogo={this.props.s3SignLogo} />
             
          <UserForm user={this.props.user} updateUser={this.props.updateUser} uploadAvatar={this.props.uploadAvatar} addFlashMessage={addFlashMessage} s3SignAvatar={this.props.s3SignAvatar} />

      </div>  
    )
  }
}

Page.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  uploadLogo: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,  s3SignLogo: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    account: state.account,
    user: state.authentication.account
  }
}

export default connect(mapSateToProps, { fetchAccount, updateAccount, updateUser, uploadLogo, uploadAvatar, s3SignLogo })(Page)

