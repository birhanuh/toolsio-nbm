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
      errors.email = T.translate("sign_in.email_required")
    }
    if (!data.password) {
      errors.password = T.translate("sign_in.password_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateProjectInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors.name = T.translate("sales.new.name_required")
    }
    if (!data.deadline) {
      errors.deadline = T.translate("sales.new.deadline_required")
    }
    if (!data.customer) {
      errors.customer = T.translate("sales.new.customer_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateSaleInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors.name = T.translate("sales.new.name_required")
    }
    if (!data.deadline) {
      errors.deadline = T.translate("sales.new.deadline_required")
    }
    if (!data.customer) {
      errors.customer = T.translate("sales.new.customer_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateTaskInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors.name = T.translate("projects.tasks.new.name_required")
    }
    if (!data.paymentType) {
      errors.paymentType = T.translate("projects.tasks.new.payment_type_required")
    }
    if (!data.hours) {
      errors.hours = T.translate("projects.tasks.new.hours_required")
    }
    if (!data.price) {
      errors.price = T.translate("projects.tasks.new.price_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateItemInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors.name = T.translate("sales.items.new.name_required")
    }
    if (!data.unit) {
      errors.unit = T.translate("sales.items.new.unit_required")
    }
    if (!data.quantity) {
      errors.quantity = T.translate("sales.items.new.quantity_required")
    }
    if (!data.price) {
      errors.price = T.translate("sales.items.new.price_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }


}  