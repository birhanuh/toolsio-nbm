import React, { Component } from 'react' 
import LoginForm from './LoginForm'

import logo from '../../images/logo-square.png'; 

class Login extends Component {
  render() {
    return (       
      <div>
        <h2 className="ui teal image header">
          <img src={logo} className="image" alt="logo-square" />
          <div className="content">
            Log-in to your account
          </div>
        </h2>
        
        <LoginForm />

        <div className="ui message">
          New to us? <a href="/signup">Sign Up</a>
        </div>
      </div>
    )
  }
}

export default Login