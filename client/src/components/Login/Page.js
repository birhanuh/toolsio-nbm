import React, { Component } from 'react' 
import Form from './Form'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'

class Page extends Component {
  render() {
    return (       
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">
            {T.translate("log_in.header")}
          </div>
        </h2>
        
        <FlashMessagesList />

        <Form />

        <div className="ui message">
          {T.translate("log_in.new_to_us")}&nbsp;<a href="/signup">{T.translate("sign_up.sign_up")}</a>
        </div>
        <div className="ui text-container mt-4">
          <small className="block-i">{T.translate("landing.footer.copyright")}</small>
          <small className="block-i">{T.translate("landing.footer.address")}</small>
        </div>
      </div>
    )
  }
}

export default Page