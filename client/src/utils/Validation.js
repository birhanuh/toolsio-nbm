import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

// Localization 
import T from 'i18n-react'

export default {

  validateRegistrationInput: (data) => {
    let errors = {}

    if (!data.email) {
      errors.email = T.translate("sign_in.email_required")
    } else {
      if (!Validator.isEmail(data.email)) {
        errors.email = T.translate("sign_un.email_format_required") 
      }
    }  
    if (!data.password) {
      errors.password = T.translate("sign_up.password_required")
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = T.translate("sign_up.password_confirmation_required")
    }
    if (data.password && data.confirmPassword) {
      if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = T.translate("sign_up.password_match_required")
      }
    }
      
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateLoginInput: (data) => {
    let errors = {}

    if (!data.email) {
      errors["email"] = {
        message: T.translate("sign_in.email_required")
      }
    }
    if (!data.password) {
      errors["password"] = {
        message: T.translate("sign_in.password_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateProjectInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = {
        message: T.translate("projects.new.name_required")
      }
    }
    if (!data.deadline) {
      errors['deadline'] = {
        message: T.translate("projects.new.deadline_required")
      }
    }
    if (!data.customer) {
      errors['customer'] = {
        message: T.translate("projects.new.customer_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateSaleInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = {
        message: T.translate("sales.new.name_required")
      }
    }
    if (!data.deadline) {
      errors['deadline'] = {
        message: T.translate("sales.new.deadline_required")
      }
    }
    if (!data.customer) {
      errors['customer'] = {
        message: T.translate("sales.new.customer_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateTaskInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = {
        message: T.translate("projects.tasks.new.name_required")
      }
    }
    if (!data.payment_type) {
      errors['payment_type'] = {
        message: T.translate("projects.tasks.new.payment_type_required")
      }
    }
    if (!data.hours) {
      errors['hours'] = {
        message: T.translate("projects.tasks.new.hours_required")
      }
    }
    if (!data.price) {
      errors['price'] = {
        message: T.translate("projects.tasks.new.price_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateItemInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = {
        message: T.translate("sales.items.new.name_required")
      }
    }
    if (!data.unit) {
      errors['unit'] = {
        message: T.translate("sales.items.new.unit_required")
      }
    }
    if (!data.quantity) {
      errors['quantity'] = {
        message: T.translate("sales.items.new.quantity_required")
      }
    }
    if (!data.price) {
      errors['price'] = {
        message: T.translate("sales.items.new.price_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }


}  