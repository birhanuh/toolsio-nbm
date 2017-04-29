import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { loginRequest } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
import classnames from 'classnames'

class LoginForm extends Component {
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
          this.context.router.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    }
  }

  render() {
    const { errors, isLoading } = this.state
   
    return (   
      <div>
        <h2 className="ui teal image header">
          <img src="/images/logo-square.png" className="image" alt="logo-square" />
          <div className="content">
            Log-in to your account
          </div>
        </h2>
        <form className="ui large form" onSubmit={this.onSubmit.bind(this)}>
          <div className="ui stacked segment">
            { errors.form && <div className="ui error message">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              {errors.form}</div> }
            <div className={classnames("field", { error: !!errors.email })}>
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder="E-mail address" 
                  value={this.state.user.email} onChange={this.onChange.bind(this)} />
                <span>{errors.email}</span>
              </div>
            </div>  
            <div className={classnames("field", { error: !!errors.password })}>
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Password" 
                  value={this.state.user.password} onChange={this.onChange.bind(this)} />
                <span>{errors.password}</span>
              </div>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">Login</button>
              
          </div>
        </form>         

        <div className="ui message">
          New to us? <a href="/users/signup">Sign Up</a>
        </div>
      </div>

      
    )
  }
}

LoginForm.propTypes = {
  loginRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { loginRequest, addFlashMessage })(LoginForm)

