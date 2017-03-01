import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { userSignupRequest } from '../../../utils/Authentication'
import classnames from 'classnames'

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
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

  onSubmit(event) {
    event.preventDefault()
    // Empty errros state for each submit
    this.setState({ errros: {}, isLoading: true })

    // Make submit
    this.props.userSignupRequest(this.state.user).then(
      () => {},
      ({ response }) => this.setState({ errors: response.data, isLoading: false })
      )
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
                  <div className={classnames("form-group", { 'has-error': errors.firstName})}>
                    <label className="control-label">First Name</label>
                    <input className="form-control" type="text" name="firstName" value={this.state.user.firstName} onChange={this.onChange.bind(this)} placeholder="First Name"/>
                    { errors.firstName && <span className="help-block">{errors.firstName}</span>}
                  </div>
                  <div className={classnames("form-group", { 'has-error': errors.lastName})}>
                    <label className="control-label">Last Name</label>
                    <input className="form-control" type="text" name="lastName" value={this.state.user.lastName} onChange={this.onChange.bind(this)} placeholder="Last Name"/>
                    { errors.firstName && <span className="help-block">{errors.lastName}</span>}
                  </div>
                  <div className={classnames("form-group", { 'has-error': errors.email})}>
                    <label className="control-label">Email</label>
                    <input className="form-control" type="email" name="email" value={this.state.user.email} onChange={this.onChange.bind(this)} placeholder="Email"/>
                    { errors.firstName && <span className="help-block">{errors.email}</span>}
                  </div>
                  <div className={classnames("form-group", { 'has-error': errors.password})}>
                    <label className="control-label">Password</label>
                    <input className="form-control" type="password" name="password" value={this.state.user.password} onChange={this.onChange.bind(this)} placeholder="Password"/>
                    { errors.firstName && <span className="help-block">{errors.password}</span>}
                  </div>
                  <div className={classnames("form-group", { 'has-error': errors.passwordConfirmation})}>
                    <label className="control-label">Confirm password</label>
                    <input className="form-control" type="password" name="passwordConfirmation" value={this.state.user.passwordConfirmation} onChange={this.onChange.bind(this)} placeholder="Confirm Password"/>
                    { errors.firstName && <span className="help-block">{errors.passwordConfirmation}</span>}
                  </div>
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
  userSignupRequest: React.PropTypes.func.isRequired
}

export default connect(null, { userSignupRequest })(Signup)