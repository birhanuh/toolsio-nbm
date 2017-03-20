import React, { Component } from 'react' 
import LoginForm from '../../containers/LoginForm'

class Login extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="panel panel-default">
            <div className="panel-body">
              <h2 className="page-header m-t-m">Login to your Account</h2>

              <LoginForm />
              
            </div>  
            <div className="panel-footer">
              <a href="/users/register">Don't have an account? Register here</a>
            </div>
          </div>
        </div>
      </div>  
    )
  }
}

export default Login