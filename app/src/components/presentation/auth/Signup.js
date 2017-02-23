import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { userSignupRequest } from '../../containers/Authentication'

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  }
  
  onChange(e) {
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[event.target.name] = event.target.value
    this.setState({
      user: updatedUser
    })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.userSignupRequest(this.state.user)
  }

  render() {
    const { userSignupRequest } = this.props
    return (
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
                <div className="form-group">
                  <label className="control-label">First name</label>
                  <input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={this.onChange.bind(this)} placeholder="First Name"/>
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={this.onChange.bind(this)} placeholder="Last Name"/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" name="email" value={this.state.email} onChange={this.onChange.bind(this)} placeholder="Email"/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.onChange.bind(this)} placeholder="Password"/>
                </div>
                <div className="form-group">
                  <label>Confirm password</label>
                  <input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.onChange.bind(this)} placeholder="Confirm Password"/>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
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
  userSignupRequest: React.PropTypes.func.isRequired
}

export default connect(null, { userSignupRequest })(Signup)