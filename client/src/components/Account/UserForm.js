import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        _id: this.props.user ? this.props.user._id : null,
        firstName: this.props.user ? this.props.user.firstName : '',
        lastName: this.props.user ? this.props.user.lastName : '',
        password: '',
        confirmPassword: ''
      },
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }
  
  handleChange(e) {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value }
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateUserInput(this.state)

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
      this.props.updateUser({ user})
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("account.form.success_update_user")
          })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )
    }  
  }

  render() {
    const { user, errors, isLoading } = this.state
   
    return (            

      <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
           
        { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
        
        <InputField
          id='firstName'
          label={T.translate("account.page.first_name")}
          name="firstName" 
          value={user.firstName} 
          onChange={this.handleChange.bind(this)} 
          placeholder={T.translate("account.page.first_name")}
          formClass="field"
        />
        <InputField
          id='lastName'
          label={T.translate("account.page.last_name")}
          name="lastName" 
          value={user.lastName} 
          onChange={this.handleChange.bind(this)} 
          placeholder={T.translate("account.page.last_name")}
          formClass="field"
        />
        <InputField
          type="password"
          name="password" 
          value={user.password} 
          id="password"
          label={T.translate("account.page.password")}
          onChange={this.handleChange.bind(this)} 
          placeholder={T.translate("account.page.password")}
          error={errors.message && errors.message.errors && errors.message.errors['password'] && errors.message.errors['password'].message}
          formClass="field"
        />
        <InputField
          type="password"
          name="confirmPassword" 
          value={user.confirmPassword} 
          id="confirmPassword"
          label={T.translate("account.page.confirm_password")}
          onChange={this.handleChange.bind(this)} 
          placeholder={T.translate("sign_up.confirm_password")}
          error={errors.confirmPassword}
          formClass="field"
        /> 

        <div className="field">  
          <Link className="ui primary outline button" to="/dashboard">
            <i className="minus circle icon"></i>
            {T.translate("account.page.cancel")}
          </Link>  
          <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.edit")}</button>
        </div>  
      </form>       

    )
  }
}

// Proptypes definition
UserForm.propTypes = {
  updateUser: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

// Contexttype definition
UserForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default UserForm


