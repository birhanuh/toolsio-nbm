import React, { Component } from 'react' 
import { connect } from 'react-redux'
import Form from './Form'
import { signupRequest, isUserExists } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  render() {
    const { signupRequest, isUserExists, addFlashMessage } = this.props
    return (      
          
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">{T.translate("sign_up.header")}</div>
        </h2>
        
        <Form signupRequest={signupRequest} isUserExists={isUserExists} addFlashMessage={addFlashMessage}/> 

        <div className="ui message"> 
          <a href="/login">{T.translate("sign_up.already_a_user")}</a>
        </div>
      </div>  
    )
  }
}

// Proptypes definition
Page.propTypes = {
  signupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
}

export default connect(null, { signupRequest, addFlashMessage, isUserExists })(Page)


