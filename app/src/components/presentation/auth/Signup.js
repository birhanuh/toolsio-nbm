import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../../utils'
import { userSignupRequest } from '../../../actions/authentication'
import { addFlashMessage } from '../../../actions/flashMessages'
import InputFiled from '../../../utils/FormGroup'
import { browserHistory } from 'react-router'

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
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
    const { errors, isValid } = Validation.validateInput(this.state.user)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  onSubmit(event) {
    event.preventDefault()
    // Empty errros state for each submit
    this.setState({ errros: {}, isLoading: true })

    if (this.isValid()) { 
      // Make submit
      this.props.userSignupRequest(this.state.user).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed up successfully!'
          })
          this.context.router.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data, isLoading: false })
        )
    }  
  }

  render() {
    const { errors } = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <h2 className="page-header m-t-m">Create an Account</h2>

                {/* if errors
                  each error in errors
                    .alert.alert-danger #{error.msg}
                */}    
                
                <form onSubmit={this.onSubmit.bind(this)}>
                  <InputFiled
                    label="First Name"
                    field="firstName" 
                    value={this.state.user.firstName} 
                    onChange={this.onChange.bind(this)} 
                    placeholder="First Name"
                    error={errors.firstName}
                  />
                  <InputFiled
                    label="Last Name"
                    field="lastName" 
                    value={this.state.user.lastName} 
                    onChange={this.onChange.bind(this)} 
                    placeholder="Last Name"
                    error={errors.lastName}
                  />
                  <InputFiled
                    label="Email"
                    field="email" 
                    type="email"
                    value={this.state.user.email} 
                    onChange={this.onChange.bind(this)} 
                    placeholder="Email"
                    error={errors.email}
                  />
                  <InputFiled
                    label="Password"
                    field="password" 
                    type="password"
                    value={this.state.user.password} 
                    onChange={this.onChange.bind(this)} 
                    placeholder="Password"
                    error={errors.password}
                  />
                  <InputFiled
                    label="Confirm password"
                    field="confirmPassword" 
                    type="password"
                    value={this.state.user.confirmPassword} 
                    onChange={this.onChange.bind(this)} 
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                  />
                  
                  <button disabled={this.state.isLoading} className="btn btn-default">Submit</button>
                </form>  
              </div>    
              <div className="panel-footer">
                <a href="/users/login">Already a user? Login here</a>
              </div>
            </div>
          </div>
        </div>  
      </div>  
    )
  }
}

// Proptypes definition
Signup.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

// Contexttype definition
Signup.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { userSignupRequest, addFlashMessage })(Signup)