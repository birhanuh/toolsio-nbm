import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import FormPage from './FormPage'
import Invitation from './Invitation'
import { Authorization } from '../../utils'
import FlashMessage from '../../flash/FlashMessage'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  
  render() {
    const { signupRequest, isSubdomainExist, isUserExist, match } = this.props
  
    let form 

    if (match && match.params.token) {
      form = <Invitation signupRequest={signupRequest} 
        isUserExist={isUserExist} />  

      // Set Invitation token to Req header
      Authorization.setInvitationToken(match.params.token)
    } else {
      form = <FormPage signupRequest={signupRequest} isSubdomainExist={isSubdomainExist} 
        isUserExist={isUserExist} /> 
    }

    return (          
      <div className="ui text container">
        <h2 className="ui teal image header">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <div className="content">{T.translate("sign_up.header")}</div>
        </h2>
        
        <FlashMessage />
        
        {form}

        <div className="ui message"> 
          {T.translate("sign_up.already_a_user")}&nbsp;<Link to="/subdomain">{T.translate("sign_up.log_in_here")}</Link>
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


