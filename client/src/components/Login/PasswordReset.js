import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Container, Segment, Header, Input, Icon, Form, Button, Message } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { PASSWORD_RESET_MUTATION } from '../../graphql/authentications'

import { Validation } from '../../utils'

import logo from '../../images/logo-square.png'

// Localization 
import T from 'i18n-react'

class PasswordReset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      token: '',
      errors: {},
      isLoading: false
    }
  }

  componentDidMount = () => {
    const url = new URL(window.location.href)
    let token = url.searchParams.get("token")

    this.setState({ token })
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
    const { password, confirmPassword } = this.state
    const { errors, isValid } = Validation.validatePasswordResetInput({password, confirmPassword})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { password, token } = this.state
  
    if (this.isValid()) {

      this.setState({ errors: {}, isLoading: true })

      this.props.mutate({variables: { password, token }})
        .then(res => {
          const { success, errors } = res.data.passwordReset
      
          if (success) {            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.flash.password_reset_success")
            })

            // Redirect to dashboard
            this.context.router.history.push('/login')
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
    const { password, confirmPassword, errors, isLoading } = this.state
  
    return (  
      <Container text>
        <Header as="h2" image className="turquoise">
          <img src={logo} className="image" alt="logo-square" />
          <Header.Content>{T.translate("log_in.reset_password")}</Header.Content>
        </Header>    

        <Segment>
          <Form size="small" loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            <Message info>
              <p>{T.translate("log_in.reset_password_description")}</p>
            </Message> 
            
            { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 

            <Form.Field> 
              <label>{T.translate("log_in.password")}</label>
              <Input
                  placeholder={T.translate("log_in.password")}
                  name="password" 
                  value={password} 
                  type='password'
                  onChange={(e, {value}) => this.handleChange('password', value)} 
                  error={!!errors.password}
                  icon={<Icon name='lock' />}
                />
                <span className="red">{errors.password}</span>
            </Form.Field>

            <Form.Field> 
              <label>{T.translate("log_in.password")}</label>
              <Input
                  placeholder={T.translate("log_in.password")}
                  name="confirmPassword" 
                  value={confirmPassword} 
                  type='password'
                  onChange={(e, {value}) => this.handleChange('confirmPassword', value)} 
                  error={!!errors.confirmPassword}
                  icon={<Icon name='lock' />}
                />
                <span className="red">{errors.confirmPassword}</span>
            </Form.Field>

            <Button primary fluid disabled={isLoading}>{T.translate("log_in.reset_password")}</Button>
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
PasswordReset.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

PasswordReset.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(PASSWORD_RESET_MUTATION)(PasswordReset))

