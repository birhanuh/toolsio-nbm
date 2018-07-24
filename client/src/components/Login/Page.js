import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import FormPage from './FormPage'
import FlashMessage from '../../flash/FlashMessage'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'

class Page extends Component {

  render() {
    return (       
      <div className="ui text container">
        <h2 className="ui teal image header">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <div className="content">
            {T.translate("log_in.header")}
          </div>
        </h2>
        
        <FlashMessage />

        <FormPage />

        <div className="ui message">
          <span>
            {T.translate("log_in.new_to_us")}&nbsp;<a href={process.env.CLIENT_PROTOCOL+process.env.CLIENT_URL+"/signup"}>{T.translate("sign_up.sign_up")}</a>
          </span>
          <span style={{float: "right"}}>
            <Link to="/login/forgot-password-request">{T.translate("log_in.forgot_your_password")}</Link>
          </span>
        </div>
        <div className="ui center aligned vertical segment">
          <small className="d-block">{T.translate("landing.footer.copy_right")}</small>
          <small className="d-block">{T.translate("landing.footer.address")}</small>
        </div>
      </div>
    )
  }
}

export default Page
