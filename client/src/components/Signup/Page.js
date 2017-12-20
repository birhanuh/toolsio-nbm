import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Form from './Form'
import { signupRequest, isAccountExists, isUserExists} from '../../actions/authenticationActions'
import { addFlashMessage } from '../../actions/flashMessageActions'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  render() {
    const { signupRequest, isAccountExists, isUserExists, addFlashMessage, account } = this.props
    
    return (          
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">{T.translate("sign_up.header")}</div>
        </h2>
        
        <FlashMessagesList />
        
        <Form signupRequest={signupRequest} isAccountExists={isAccountExists} 
        isUserExists={isUserExists} addFlashMessage={addFlashMessage}
        account={account}/> 

        <div className="ui message"> 
          {T.translate("sign_up.already_a_user")}&nbsp;<a href="/login">{T.translate("sign_up.log_in_here")}</a>
        </div>
        <div className="ui text-container mt-4">
          <small className="block-i">{T.translate("landing.footer.copyright")}</small>
          <small className="block-i">{T.translate("landing.footer.address")}</small>
        </div>
      </div>  
    )
  }
}

// Proptypes definition
Page.propTypes = {
  signupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isAccountExists: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    account: state.authentication.account
  } 
}

export default connect(mapStateToProps, { signupRequest, addFlashMessage, isAccountExists, isUserExists })(Page)


