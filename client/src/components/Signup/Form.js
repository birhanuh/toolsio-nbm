import React, { Component } from 'react' 
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

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
      errors: {},
      isLoading: false,
      invalid: false
    }
  }
  
  onChange(e) {
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[e.target.name] = e.target.value
    this.setState({
      user: updatedUser
    })
  }

  checkUserExists(e) {
    const field = e.target.name
    const val = e.target.value
    if (val !== '') {
      this.props.isUserExists(val).then(res => {
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
    const { errors, isValid } = Validation.validateRegistrationInput(this.state.user)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (true) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoading: true })
      
      // Make submit
      this.props.signupRequest(this.state.user).then(
        (response) => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed up successfully!'
          })
          console.log('response: ', response)
          //this.context.histrory.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )
    }  
  }

  render() {
    const { errors, isLoading, invalid } = this.state
    
    return (            
      <form className="ui large form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
          
          <InputField
            label={T.translate("sign_up.first_name")}
            name="firstName" 
            value={this.state.user.firstName} 
            onChange={this.onChange.bind(this)} 
            placeholder={T.translate("sign_up.first_name")}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.last_name")}
            name="lastName" 
            value={this.state.user.lastName} 
            onChange={this.onChange.bind(this)} 
            placeholder={T.translate("sign_up.last_name")}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.email")}
            name="email" 
            type="email"
            value={this.state.user.email} 
            onChange={this.onChange.bind(this)} 
            checkUserExists={this.checkUserExists.bind(this)} 
            placeholder={T.translate("sign_up.email")}
            error={errors.message && errors.message.errors && errors.message.errors['email'] && errors.message.errors['email'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.password")}
            name="password" 
            type="password"
            value={this.state.user.password} 
            onChange={this.onChange.bind(this)} 
            placeholder={T.translate("sign_up.password")}
            error={errors.message && errors.message.errors && errors.message.errors['password'] && errors.message.errors['password'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.confirm_password")}
            name="confirmPassword" 
            type="password"
            value={this.state.user.confirmPassword} 
            onChange={this.onChange.bind(this)} 
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
  signupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
}

// Contexttype definition
Form.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Form


