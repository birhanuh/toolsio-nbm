import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Authorization } from '../../utils'
import { fetchAccount, updateAccount, uploadLogo, s3SignLogo } from '../../actions/accountActions'
import { fetchUser, updateUser, uploadAvatar, s3SignAvatar } from '../../actions/userActions'
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

    // Fetch account
    const { currentAccount } = this.props
    this.props.fetchUser(currentAccount && currentAccount.email)

  }

  render() {
    
    return (
      <div className="ui stackable grid account">  

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

function mapSateToProps(state, props) {
  
  const { currentAccount } = props
  
  return {
    account: state.account,
    user: state.users.find(item => item.email === currentAccount.email)
  }
}

export default connect(mapSateToProps, { fetchAccount, updateAccount, fetchUser, updateUser, uploadLogo, uploadAvatar, s3SignLogo, s3SignAvatar })(Page)


