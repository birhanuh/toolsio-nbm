import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { userSignupRequest, isUserExists } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
import FormGroup from '../../utils/FormGroup'
import { browserHistory } from 'react-router'

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      
    }
  }
  


  render() {
    return (      
 
    )
  }
}

// Proptypes definition
Signup.propTypes = {
}

// Contexttype definition
Signup.contextTypes = {
}

export default Signup

