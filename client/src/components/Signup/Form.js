import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: {
        companyName: '', 
        industry: ''
      },
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
    if (e.target.name === "companyName" || e.target.name === "industry") {
      this.setState({
        account: { ...this.state.account, [e.target.name]: e.target.value }
      })
    }
    else if (e.target.name === "firstName" || e.target.name === "lastName" || e.target.name === "email"
        || e.target.name === "password" || e.target.name === "confirmPassword") {
      this.setState({
        user: { ...this.state.user, [e.target.name]: e.target.value }
      })
    }  
  }

  checkAccountExists(e) {
    const field = e.target.name
    const val = e.target.value
    if (val !== '') {
      this.props.isAccountExists(val).then(res => {
        let errors = this.state.errors
        let invalid
        if (res.data.account[0]) {
          errors['message'] = {
            errors: {
              companyName: {
                message: 'There is account with such '+field+ '.'
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
    const { errors, isValid } = Validation.validateRegistrationInput(this.state)

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
      
      const { account, user } = this.state
      // Make submit
      this.props.signupRequest({account, user}).then(
        (response) => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed up successfully!'
          })
          this.context.router.history.push('/dashboard')
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
            label={T.translate("sign_up.first_name")}
            name="firstName" 
            value={user.firstName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.first_name")}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.last_name")}
            name="lastName" 
            value={user.lastName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.last_name")}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.email")}
            name="email" 
            type="email"
            value={user.email} 
            onChange={this.handleChange.bind(this)} 
            checkUserExists={this.checkUserExists.bind(this)} 
            placeholder={T.translate("sign_up.email")}
            error={errors.message && errors.message.errors && errors.message.errors['email'] && errors.message.errors['email'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.password")}
            name="password" 
            type="password"
            value={user.password} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.password")}
            error={errors.message && errors.message.errors && errors.message.errors['password'] && errors.message.errors['password'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("sign_up.confirm_password")}
            name="confirmPassword" 
            type="password"
            value={user.confirmPassword} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.confirm_password")}
            error={errors.confirmPassword}
            formClass="field"
          />
          <SelectField
            label={T.translate("sign_up.account.industry")}
            name="industry"
            type="select"
            value={account.industry} 
            onChange={this.handleChange.bind(this)} 
            error={errors.message && errors.message.errors && errors.message.errors.industry && errors.message.errors['industry'].message}
            formClass="field"

            options={[
              <option key="default" value="" disabled>{T.translate("sign_up.account.select_industry")}</option>,
              <option key="human resource" value="human resource">Human resource</option>,
              <option key="fashion" value="fashion">Fashion</option>,
              <option key="import/export" value="import/export">Import/Export</option>,
              <option key="store" value="store">Store</option>,
              <option key="technology" value="technology">Technology</option>
              ]
            }
          />
          <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.companyName })}>
            <div className="ui right labeled input">
              <input type="text" name="companyName" placeholder={T.translate("sign_up.account.company_name")} 
                onBlur={this.checkAccountExists.bind(this)} value={account.companyName} onChange={this.handleChange.bind(this)} />
              <div className="ui label">toolsio.com</div>  
            </div>
            <span className="red">{errors.message && errors.message.errors && errors.message.errors.companyName && errors.message.errors.companyName.message}</span>
          </div>  

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
  isAccountExists: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
}

// Contexttype definition
Form.contextTypes = {
  router: PropTypes.object.isRequired
}

export default Form


