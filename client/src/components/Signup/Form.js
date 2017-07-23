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
  
  onChange(event) {
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[event.target.name] = event.target.value
    this.setState({
      user: updatedUser
    })
  }

  checkUserExists(event) {
    const field = event.target.name
    const val = event.target.value
    if (val !== '') {
      this.props.isUserExists(val).then(res => {
        let errors = this.state.errors
        let invalid
        if (res.data.user[0]) {
          errors[field] = 'There is user with such '+ field
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

  onSubmit(e) {
    e.preventDefault()

    if (this.isValid()) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoading: true })
      
      // Make submit
      this.props.signupRequest(this.state.user).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed up successfully!'
          })
          this.context.histrory.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data, isLoading: false })
      )
    }  
  }

  render() {
    const { errors, isLoading, invalid } = this.state
    return (            
        <form className="ui large form" onSubmit={this.onSubmit.bind(this)}>
          <div className="ui stacked segment">
            <InputField
              label={T.translate("sign_up.first_name")}
              name="firstName" 
              value={this.state.user.firstName} 
              onChange={this.onChange.bind(this)} 
              placeholder={T.translate("sign_up.first_name")}
              error={errors.firstName}
              formClass="field"
            />
            <InputField
              label={T.translate("sign_up.last_name")}
              name="lastName" 
              value={this.state.user.lastName} 
              onChange={this.onChange.bind(this)} 
              placeholder={T.translate("sign_up.last_name")}
              error={errors.lastName}
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
              error={errors.email}
              formClass="field"
            />
            <InputField
              label={T.translate("sign_up.password")}
              name="password" 
              type="password"
              value={this.state.user.password} 
              onChange={this.onChange.bind(this)} 
              placeholder={T.translate("sign_up.password")}
              error={errors.password}
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


