import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { loginRequest } from '../../actions/authenticationActions'
import { addFlashMessage } from '../../actions/flashMessagesActions'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        email: '',
        password: ''
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
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[e.target.name] = e.target.value
    this.setState({
      user: updatedUser
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateLoginInput(this.state.user)

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
      this.setState({ errros: {}, isLoading: true })
      this.props.loginRequest(this.state.user).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed in successfully!'
          })
          this.context.router.history.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    }
  }

  render() {
    const { errors, isLoading } = this.state
   
    return (  
        <form className="ui large form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("log_in.email")} 
                  value={this.state.user.email} onChange={this.handleChange.bind(this)} />
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.email && errors.message.errors.email.message}</span>
            </div>  
            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.password })}>
              <div className="ui right icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder={T.translate("log_in.password")}
                  value={this.state.user.password} onChange={this.handleChange.bind(this)} />                
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.password && errors.message.errors.password.message}</span>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.log_in")}</button>
              
          </div>
        </form>         
      
    )
  }
}

Form.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { loginRequest, addFlashMessage })(Form)

