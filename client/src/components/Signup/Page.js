import React, { Component } from 'react' 
import Form from './Form'
import Invitation from './Invitation'
import { Authorization } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
import FlashMessage from '../../flash/FlashMessage'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  render() {

    const { signupRequest, isSubdomainExist, isUserExist, addFlashMessage, match } = this.props
  
    let form 

    if (match && match.params.token) {
      form = <Invitation signupRequest={signupRequest} 
        isUserExist={isUserExist} addFlashMessage={addFlashMessage} />  

      // Set Invitation token to Req header
      Authorization.setInvitationToken(match.params.token)
    } else {
      form = <Form signupRequest={signupRequest} isSubdomainExist={isSubdomainExist} 
        isUserExist={isUserExist} addFlashMessage={addFlashMessage} /> 
    }

    return (          
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">{T.translate("sign_up.header")}</div>
        </h2>
        
        <FlashMessage />
        
        {form}

        <div className="ui message"> 
          {T.translate("sign_up.already_a_user")}&nbsp;<a href="/login">{T.translate("sign_up.log_in_here")}</a>
        </div>
        <div className="ui center aligned vertical segment">
          <small className="d-block">{T.translate("landing.footer.copyright")}</small>
          <small className="d-block">{T.translate("landing.footer.address")}</small>
        </div>
      </div>  
    )
  }
}

export default Page


