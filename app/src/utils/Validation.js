import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

export default {

  validateInput: (data) => {
    let errors = {}

    if (!data.firstName) {
      errors.firstName = 'First Name is required'
    }
    if (!data.lastName) {
      errors.lastName = 'Last Name is required'
    }
    if (!data.email) {
      errors.email = 'Email is required'
    } else {
      if (!Validator.isEmail(data.email)) {
        errors.email = 'Wrong Email format'
      }
    }  
    if (!data.password) {
      errors.password = 'Password is required'
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Password confirmation is required'
    }
    if (data.password && data.confirmPassword) {
      if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Password doesn't match"
      }
    }
      
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }

}  