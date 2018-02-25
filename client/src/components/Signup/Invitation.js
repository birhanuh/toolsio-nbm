import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false,
      invalid: false
    }
  }
  
  handleChange(e) {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value }
    })
  }

  checkUserExist(e) {
    const field = e.target ? e.target.name : 'email'
    const val = e.target ? e.target.value : e
    if (val !== '') {
      this.props.isUserExist(val).then(res => {
        let errors = this.state.errors
        let invalid
        if (res.data.user[0]) {
          errors['message'] = {
            errors: {
              email: {
                message: 'There is user with such '+field+ '.'
              }  
            }  
          }
          invalid = true
        } else {
          errors[field] = ''
          invalid = false
        }
        this.setState({ errors, invalid })
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateInvitationRegistrationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.isValid()) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoading: true })
      
      const { user } = this.state
      // Make submit
      this.props.signupRequest({ user}).then(
        (res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sign_up.success_create")
          })
          window.location = `http://${this.props.account.subdomain}.lvh.me:3000/login`
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )
    }  
  }

  render() {
    const { account, user, errors, isLoading, invalid } = this.state
   
    return (            
      <form className="ui large form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
          
          <InputField
            id='firstName'
            label={T.translate("sign_up.first_name")}
            name="firstName" 
            value={user.firstName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.first_name")}
            formClass="field"
          />
          <InputField
            id='lastName'
            label={T.translate("sign_up.last_name")}
            name="lastName" 
            value={user.lastName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.last_name")}
            formClass="field"
          />
          <InputField
            type="email"
            name="email" 
            value={user.email} 
            id='email'
            label={T.translate("sign_up.email")}
            onChange={this.handleChange.bind(this)} 
            onBlur={this.checkUserExist.bind(this)} 
            placeholder={T.translate("sign_up.email")}
            error={errors.message && errors.message.errors && errors.message.errors['email'] && errors.message.errors['email'].message}
            formClass="field"
          />
          <InputField
            type="password"
            name="password" 
            value={user.password} 
            id="password"
            label={T.translate("sign_up.password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.password")}
            error={errors.message && errors.message.errors && errors.message.errors['password'] && errors.message.errors['password'].message}
            formClass="field"
          />
          <InputField
            type="password"
            name="confirmPassword" 
            value={user.confirmPassword} 
            id="confirmPassword"
            label={T.translate("sign_up.confirm_password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.confirm_password")}
            error={errors.confirmPassword}
            formClass="field"
          /> 

          <button disabled={isLoading || invalid} className="ui fluid large teal submit button">{T.translate("sign_up.sign_up")}</button>
        </div>
      </form>         

    )
  }
}

// Proptypes definition
Form.propTypes = {
  signupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExist: PropTypes.func.isRequired
}

// Contexttype definition
Form.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    account: state.authentication && state.authentication.account
  } 
}

export default connect(mapStateToProps, {}) (Form)


