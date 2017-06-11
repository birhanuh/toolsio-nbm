import React, { Component } from 'react' 
import Form from './Form'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  render() {
    return (       
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">
            Log-in to your account
          </div>
        </h2>
        
        <Form />

        <div className="ui message">
          New to us? <a href="/signup">Sign Up</a>
        </div>
      </div>
    )
  }
}

export default Page