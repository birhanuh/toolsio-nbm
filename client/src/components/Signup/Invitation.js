import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'
import classnames from 'classnames'
import jwt from 'jsonwebtoken'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

// Config
import jwtConfig from '../../../../config/jwt.json'

class Invitation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      token: null,
      errors: {},
      isLoading: false
    }
  }
  
  componentDidMount = () => {
    const url = new URL(window.location.href)
    let token = url.searchParams.get("token")
  
    const { email } = jwt.verify(token, jwtConfig.jwtSecret1)

    this.setState({ email, token })
  }

  handleChange(e) {
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
    const { errors, isValid } = Validation.validateInvitationRegistrationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.isValid()) { 
      
      this.setState({ isLoading: true })
      
      const { firstName, lastName, email, password, token } = this.state
      
      this.props.mutate({variables: { firstName, lastName, email, password, token }})
        .then(res => {
      
          const { success, account, errors } = res.data.registerInvitedUser
         
          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sign_up.success_create")
            })
            
            // Redirect to login
            window.location = `${process.env.HTTP}${account.subdomain}.${process.env.DNS}/login`
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
    const { firstName, email, lastName, password, confirmPassword, errors, isLoading, invalid } = this.state

    return (            
      <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
          
          <InputField
            id='firstName'
            label={T.translate("sign_up.first_name")}
            name="firstName" 
            value={firstName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.first_name")}
            error={errors && errors.firstName}
            formClass="field"
          />
          <InputField
            id='lastName'
            label={T.translate("sign_up.last_name")}
            name="lastName" 
            value={lastName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.last_name")}
            error={errors && errors.lastName}
            formClass="field"
          />
          <InputField
            type="email"
            name="email" 
            value={email} 
            id='email'
            label={T.translate("sign_up.email")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.email")}
            error={errors && errors.email}
            formClass="field"
            disabled="true"
          />
          <InputField
            type="password"
            name="password" 
            value={password} 
            id="password"
            label={T.translate("sign_up.password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.password")}
            error={errors && errors.password}
            formClass="field"
          />
          <InputField
            type="password"
            name="confirmPassword" 
            value={confirmPassword} 
            id="confirmPassword"
            label={T.translate("sign_up.confirm_password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.confirm_password")}
            error={errors.confirmPassword}
            formClass="field"
          /> 

          <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("sign_up.sign_up")}</button>
        </div>
      </form>         

    )
  }
}

// Proptypes definition
Invitation.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

// Contexttype definition
Invitation.contextTypes = {
  router: PropTypes.object.isRequired
}

const sendInvitationMutation = gql`
  mutation($firstName: String, $lastName: String, $email: String!, $password: String!, $token: String!) {
    registerInvitedUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, token: $token) {
      success
      account {
        subdomain
      }
      errors {
        path
        message
      }
    }
  }
`

export default connect(null, { addFlashMessage }) (graphql(sendInvitationMutation)(Invitation))


