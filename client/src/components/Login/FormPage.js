import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, Icon, Form, Message } from 'semantic-ui-react'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import { LOGIN_USER_MUTATION } from '../../graphql/authentications'

import { Validation } from '../../utils'

import { wsLink } from '../../apollo'

// Localization 
import T from 'i18n-react'

class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    }
  }
  /*
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
  }*/

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
    const { email, password } = this.state
    const { errors, isValid } = Validation.validateLoginInput({email, password})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { email, password } = this.state
  
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true })

      this.props.mutate({variables: { email, password }})
        .then(res => {
          const { success, authToken, refreshAuthToken, errors } = res.data.loginUser
      
          if (success) {
            localStorage.setItem('authToken', authToken)
            localStorage.setItem('refreshAuthToken', refreshAuthToken)
            
            // Re-connect to wsLink
            wsLink.subscriptionClient.tryReconnect()
            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.flash.log_in_success")
            })

            // Redirect to dashboard
            this.context.router.history.push('/dashboard')
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
    const { email, password, errors, isLoading } = this.state
  
    return (  
        <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && <Message error><p>{errors.message}</p></Message> } 

            <Form.Field> 
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
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.log_in")}</button>
              
          </div>
        </Form>         
      
    )
  }
}

// Proptypes definition
FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(LOGIN_USER_MUTATION)(FormPage))

