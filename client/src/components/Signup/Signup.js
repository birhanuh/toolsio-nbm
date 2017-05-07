import React, { Component } from 'react' 
import { connect } from 'react-redux'
import SignupForm from './SignupForm'
import { signupRequest, isUserExists } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'

import logo from '../../images/logo-square.png'; 

class Signup extends Component {
  render() {
    const { signupRequest, isUserExists, addFlashMessage } = this.props
    return (      
          
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">
            Create an account
          </div>
        </h2>
        
        <SignupForm signupRequest={signupRequest} isUserExists={isUserExists} addFlashMessage={addFlashMessage}/> 

        <div className="ui message"> 
          <a href="/users/login">Already a user? Login here</a>
        </div>
      </div>  
    )
  }
}

// Proptypes definition
Signup.propTypes = {
  signupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
}

export default connect(null, { signupRequest, addFlashMessage, isUserExists })(Signup)


