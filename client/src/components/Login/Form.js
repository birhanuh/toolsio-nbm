import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// Semantic UI Form elements
import { Segment, Input, Icon, Form as FormElement, Button, Message } from 'semantic-ui-react'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql, compose } from 'react-apollo'
import { LOGIN_USER_MUTATION, VERIFY_USER_EMIAIL_MUTATION } from '../../graphql/authentications'

import { Validation, isAuthenticated } from '../../utils'

import { wsLink } from '../../apollo'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    }
  }
  
  componentDidMount = () => {
    // Retrieve token
    const url = new URL(window.location.href)
    let token = url.searchParams.get("token")

    if (token) {
      this.props.confirmUserEmailMutation({variables: { token }})
        .then(res => {
          
          const { success, errors } = res.data.confirmUserEmail
      
          if (success) {            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.flash.confirm_email_success")
            })

            // Redirect to dashboard
            if (isAuthenticated) {
              this.context.router.history.push('/dashboard')  
            }
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
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
          const { success, sessionID, user, subdomain, errors } = res.data.loginUser

          let date = new Date()
          date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * 7) // 7 days

          document.cookie = 'currentAccount='+ JSON.stringify({accout: subdomain, id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email}) +';expires=' + date.toUTCString();
          
          console.log('sessionID: ', sessionID)
          if (success) {
            
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
      <Segment>
        <FormElement loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
          { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 

          <FormElement.Field error={!!errors.email}> 
            <label>{T.translate("log_in.email")}</label>
            <Input
                placeholder={T.translate("log_in.email")}
                value={email} 
                name='email'
                type='email'
                onChange={(e, {value}) => this.handleChange('email', value)} 
                error={!!errors.email}
                icon={<Icon name='user' />}
              />
              <span className="red">{errors.email}</span>
          </FormElement.Field>
          <FormElement.Field error={!!errors.password}> 
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
          </FormElement.Field>
                
          <Button primary size="large" fluid disabled={isLoading}>{T.translate("log_in.log_in")}</Button>
        </FormElement>         
      </Segment>
    )
  }
}

// Proptypes definition
Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const Mutations =  compose(
  graphql(LOGIN_USER_MUTATION),
  graphql(VERIFY_USER_EMIAIL_MUTATION, {
    name: 'confirmUserEmailMutation'
  })
)(Form)

export default connect(null, { addFlashMessage }) (Mutations)

