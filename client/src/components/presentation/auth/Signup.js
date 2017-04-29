import React, { Component } from 'react' 
import { connect } from 'react-redux'
import SignupForm from '../../containers/SignupForm'
import { signupRequest, isUserExists } from '../../../actions/authentication'
import { addFlashMessage } from '../../../actions/flashMessages'

class Signup extends Component {
  render() {
    const { signupRequest, isUserExists, addFlashMessage } = this.props
    return (      
      
      <SignupForm signupRequest={signupRequest} isUserExists={isUserExists} addFlashMessage={addFlashMessage}/>  
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


