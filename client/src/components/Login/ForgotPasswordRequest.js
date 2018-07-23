import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import FlashMessage from '../../flash/FlashMessage'
import { graphql } from 'react-apollo'
import { FORGOT_PASSWORD_REQUEST_MUTATION } from '../../graphql/authentications'

import { Validation } from '../../utils'

import logo from '../../images/logo-square.png'

// Localization 
import T from 'i18n-react'

class ForgotPasswordRequest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {
    if (this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  isValid() {
    const { email } = this.state
    const { errors, isValid } = Validation.validateForgotPasswordResetRequestInput({email})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { email } = this.state
  
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true })

      this.props.mutate({variables: { email }})
        .then(res => {
          const { success, errors } = res.data.forgotPasswordResetRequest
      
          if (success) {            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.flash.forgot_password_request_email_sent")
            })

            this.setState({ isLoading: false })
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
  }

  render() {
    const { email, errors, isLoading } = this.state
  
    return (  
      <div className="ui text container">
        <h2 className="ui teal image header">
          <img src={logo} className="image" alt="logo-square" />
          <div className="content">{T.translate("log_in.request_password_reset")}</div>
        </h2>     

        <FlashMessage />

        <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("log_in.email")} 
                  value={email} onChange={this.handleChange} />
              </div>
              <span className="red">{errors.email}</span>
            </div>  
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.send_request")}</button>
              
          </div>
        </form>         
      </div>
    )
  }
}

// Proptypes definition
ForgotPasswordRequest.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

ForgotPasswordRequest.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(FORGOT_PASSWORD_REQUEST_MUTATION)(ForgotPasswordRequest))

