import React, { Component } from 'react' 
import { PropTypes } from 'prop-types'
import Form from './Form'
import { connect } from 'react-redux'
import { confirmEmail } from '../../actions/authenticationActions'
import { addFlashMessage } from '../../actions/flashMessageActions'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'

class Page extends Component {

  componentDidMount = () => {

    const { match } = this.props

    if (match && match.params.token) {
      this.props.confirmEmail(match.params.token)
        .then(res => {
        
          if (res.data.confirmed) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.confirm_email.success")
            })
          } else {
            this.props.addFlashMessage({
              type: 'info',
              text: T.translate("log_in.confirm_email.info")
            })
          }

        })
    }
  }

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
        <div className="ui center aligned vertical segment">
          <small className="block-i">{T.translate("landing.footer.copyright")}</small>
          <small className="block-i">{T.translate("landing.footer.address")}</small>
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  // confirmEmail: PropTypes.func.isRequired,
  // addFlashMessage: PropTypes.func.isRequired
}

export default Page
