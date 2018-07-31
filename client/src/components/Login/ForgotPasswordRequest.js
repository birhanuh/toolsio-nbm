import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Container, Segment, Header, Input, Icon, Form, Button, Message } from 'semantic-ui-react'
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

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      this.setState({
        [name]: value,
        errors
      })
    } else {
      this.setState({
        [name]: value
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
      <Container text>
        <Header as="h2" image className="turquoise">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <Header.Content>{T.translate("log_in.request_password_reset")}</Header.Content>
        </Header>    

        <Segment>

          <FlashMessage />

          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 

             <Form.Field error={!!errors.email}> 
              <label>{T.translate("log_in.email")}</label>
              <Input
                  placeholder={T.translate("log_in.email")}
                  value={email} 
                  type='email'
                  onChange={(e, {value}) => this.handleChange('email', value)} 
                  error={!!errors.email}
                  icon={<Icon name='user' />}
                />
                <span className="red">{errors.email}</span>
            </Form.Field>
                  
            <Button disabled={isLoading} primary fluid>{T.translate("log_in.send_request")}</Button>
          </Form>   
        </Segment> 

        <Segment vertical align="center">
          <small className="d-block">{T.translate("landing.footer.copy_right")}</small>
          <small className="d-block">{T.translate("landing.footer.address")}</small>
        </Segment>          
      </Container>
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

