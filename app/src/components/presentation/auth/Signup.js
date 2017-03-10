import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../../utils'
import { userSignupRequest, isUserExists } from '../../../actions/authentication'
import { addFlashMessage } from '../../../actions/flashMessages'
import FormGroup from '../../../utils/FormGroup'
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
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="panel panel-default">
            <div className="panel-body">
              <h2 className="page-header m-t-m">Create an Account</h2>
              
              <form onSubmit={this.onSubmit.bind(this)}>
                <FormGroup
                  label="First Name"
                  field="firstName" 
                  value={this.state.user.firstName} 
                  onChange={this.onChange.bind(this)} 
                  placeholder="First Name"
                  error={errors.firstName}
                />
                <FormGroup
                  label="Last Name"
                  field="lastName" 
                  value={this.state.user.lastName} 
                  onChange={this.onChange.bind(this)} 
                  placeholder="Last Name"
                  error={errors.lastName}
                />
                <FormGroup
                  label="Email"
                  field="email" 
                  type="email"
                  value={this.state.user.email} 
                  onChange={this.onChange.bind(this)} 
                  checkUserExists={this.checkUserExists.bind(this)} 
                  placeholder="Email"
                  error={errors.email}
                />
                <FormGroup
                  label="Password"
                  field="password" 
                  type="password"
                  value={this.state.user.password} 
                  onChange={this.onChange.bind(this)} 
                  placeholder="Password"
                  error={errors.password}
                />
                <FormGroup
                  label="Confirm password"
                  field="confirmPassword" 
                  type="password"
                  value={this.state.user.confirmPassword} 
                  onChange={this.onChange.bind(this)} 
                  placeholder="Confirm password"
                  error={errors.confirmPassword}
                />
                
                <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary">Submit</button>
              </form>         
                 
            </div>  
            <div className="panel-footer">
              <a href="/users/login">Already a user? Login here</a>
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
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
}

// Contexttype definition
Signup.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { userSignupRequest, addFlashMessage, isUserExists })(Signup)

