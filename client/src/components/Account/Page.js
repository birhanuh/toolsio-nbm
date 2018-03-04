import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Authorization } from '../../utils'
import { fetchAccount, updateAccount } from '../../actions/accountActions'
import { updateUser } from '../../actions/userActions'
import { addFlashMessage } from '../../actions/flashMessageActions'

import AccountForm from './AccountForm'
import UserForm from './UserForm'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

// Images
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'
import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

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


        <div className="twelve wide column"> 
          <div className="ui items segment">
            <div className="ui item">    
              <div className="image">
                <img className="ui centered tiny rounded image" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
              </div>
            
              <div className="content">
                <h1 className="ui header">{T.translate("account.page.account")}</h1>
                <AccountForm account={this.props.account} updateAccount={this.props.updateAccount} addFlashMessage={addFlashMessage}  />
              </div>

            </div>   
          </div>

          <div className="ui items segment">
            <div className="ui item">    
              <div className="image">
                <img className="ui avatar image" src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
              </div>

              <div className="content">                
                <h1 className="ui header">{T.translate("account.page.user")}</h1> 
                <UserForm user={this.props.user} updateUser={this.props.updateUser} addFlashMessage={addFlashMessage}  />
              </div>  
            </div> 
          </div>   
        </div>

      </div>  
    )
  }
}

Page.propTypes = {
  updateAccount: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    account: state.account,
    user: state.authentication.account
  }
}

export default connect(mapSateToProps, { fetchAccount, updateAccount, updateUser })(Page)
