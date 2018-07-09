import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import Form from './Form'
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

        <Form />

        <div className="ui message">
          {T.translate("log_in.new_to_us")}&nbsp;<a href={process.env.CLIENT_PROTOCOL+process.env.CLIENT_URL+"/signup"}>{T.translate("sign_up.sign_up")}</a>
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
