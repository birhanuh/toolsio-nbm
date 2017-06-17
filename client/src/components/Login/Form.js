import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { loginRequest } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
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
      errors: {},
      isLoading: false
    }
  }

  onChange(event) {
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[event.target.name] = event.target.value
    this.setState({
      user: updatedUser
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateLoginInput(this.state.user)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  onSubmit(event) {
    event.preventDefault()
    
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
        <form className="ui large form" onSubmit={this.onSubmit.bind(this)}>
          <div className="ui stacked segment">

            { errors.form && <div className="ui negative message"><p>{errors.form}</p></div> }

            <div className={classnames("field", { error: !!errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("sign_in.email")} 
                  value={this.state.user.email} onChange={this.onChange.bind(this)} />
                <span>{errors.email}</span>
              </div>
            </div>  
            <div className={classnames("field", { error: !!errors.password })}>
              <div className="ui right icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder={T.translate("sign_in.password")}
                  value={this.state.user.password} onChange={this.onChange.bind(this)} />
                <span>{errors.password}</span>
              </div>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("sign_in.sign_in")}</button>
              
          </div>
        </form>         
      
    )
  }
}

Form.propTypes = {
  loginRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

Form.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { loginRequest, addFlashMessage })(Form)

