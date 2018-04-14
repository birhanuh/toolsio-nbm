import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

// Localization 
import T from 'i18n-react'

export default {

  validateRegistrationInput: (data) => {
    let errors = {}

    if (!data.user.email) {
      errors["email"] = T.translate("log_in.email_required")
    } else {
      if (!Validator.isEmail(data.user.email)) {
        errors["email"] = T.translate("sign_un.email_format_required")  
      }
    }  
    if (!data.user.password) {
      errors["password"] = T.translate("sign_up.password_required") 
    }
    if (!data.user.confirm_password) {
      errors["confirm_password"] = T.translate("sign_up.password_confirmation_required")
    }
    if (data.user.password && data.confirm_password) {
      if (!Validator.equals(data.password, data.confirm_password)) {
        errors["confirm_password"] = T.translate("sign_up.password_match_required") 
      }
    }    
    if (!data.account.subdomain) {
      errors["subdomain"] = T.translate("sign_up.account.subdomain_required")
    }
    if (!data.account.industry) {
      errors["industry"] = T.translate("sign_up.account.industry_required")
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateInvitationRegistrationInput: (data) => {
    let errors = {}

    if (!data.user.email) {
      errors["email"] = T.translate("log_in.email_required")
    } else {
      if (!Validator.isEmail(data.user.email)) {
        errors["email"] = T.translate("sign_un.email_format_required")  
      }
    }  
    if (!data.user.password) {
      errors["password"] = T.translate("sign_up.password_required") 
    }
    if (!data.user.confirm_password) {
      errors["confirm_password"] = T.translate("sign_up.password_confirmation_required")
    }
    if (data.user.password && data.confirm_password) {
      if (!Validator.equals(data.password, data.confirm_password)) {
        errors["confirm_password"] = T.translate("sign_up.password_match_required") 
      }
    } 

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateAccountInput: (data) => {
    let errors = {}

    if (!data.subdomain) {
      errors["subdomain"] = T.translate("sign_up.account.subdomain_required")
    } 
    if (!data.industry) {
      errors["industry"] = T.translate("sign_up.account.industry_required")
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateUserInput: (data) => {
    let errors = {}

    if (!data.user.password) {
      errors["password"] = T.translate("sign_up.password_required") 
    }
    if (!data.user.confirm_password) {
      errors["confirm_password"] = T.translate("sign_up.password_confirmation_required")
    }
    if (data.user.password && data.confirm_password) {
      if (!Validator.equals(data.password, data.confirm_password)) {
        errors["confirm_password"] = T.translate("sign_up.password_match_required") 
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
      errors["email"] = T.translate("log_in.email_required")
    }
    if (!data.password) {
      errors["password"] = T.translate("log_in.password_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateSubdomainInput: (data) => {
    let errors = {}

    if (!data) {
      errors["subdomain"] = T.translate("log_in.subdomain.subdomain_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateProjectInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("projects.form.name_required")
    }
    if (!data.deadline) {
      errors['deadline'] = T.translate("projects.form.deadline_required")
    }
    if (!data.customer) {
      errors['customer'] = T.translate("projects.form.customer_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateSaleInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("sales.form.name_required")
    }
    if (!data.deadline) {
      errors['deadline'] = T.translate("sales.form.deadline_required")
    }
    if (!data.customer) {
      errors['customer'] = T.translate("sales.form.customer_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateTaskInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("projects.tasks.form.name_required")
    }
    if (!data.paymentType) {
      errors['paymentType'] = T.translate("projects.tasks.form.payment_type_required")
    }
    if (!data.hours) {
      errors['hours'] = T.translate("projects.tasks.form.hours_required")
    }
    if (!data.price) {
      errors['price'] = T.translate("projects.tasks.form.price_required")
    }
    if (!data.vat) {
      errors['vat'] = T.translate("projects.tasks.form.vat_required")
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateItemInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("sales.items.form.name_required")
    }
    if (!data.unit) {
      errors['unit'] = T.translate("sales.items.form.unit_required")
    }
    if (!data.quantity) {
      errors['quantity'] = T.translate("sales.items.form.quantity_required")
    }
    if (!data.price) {
      errors['price'] = T.translate("sales.items.form.price_required")
    }
    if (!data.vat) {
      errors['vat'] = T.translate("sales.items.form.vat_required")
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateCustomerInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("customers.form.name_required")
    }
    if (!data.contact.phoneNumber && !data.contact.email) {
      errors['phoneNumber'] = T.translate("customers.form.phone_number_or_email_required")
       errors['email'] = T.translate("customers.form.phone_number_or_email_required")
    }
    if (!data.address.street) {
      errors['street'] = T.translate("customers.form.street_required")
    }
    if (!data.address.postalCode) {
      errors['postalCode'] = T.translate("customers.form.postal_code_required")
    }
    if (!data.address.region) {
      errors['region'] = T.translate("customers.form.region_required")
    }
    if (!data.address.country) {
      errors['country'] = T.translate("customers.form.country_required")
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateInvoiceInput: (data) => {
    let errors = {}
    
    if (data.currentStep === 'step1') {
      if ((!data.step1.saleId && !data.step1.projectId) || (data.step1.saleId && data.step1.projectId)) {
        errors['saleId'] = T.translate("invoices.form.sale_or_project_required")
        errors['projectId'] = T.translate("invoices.form.sale_or_project_required")
      }      
    }

    if (data.currentStep === 'step2') {
      if (data.step2.deadline && data.step2.paymentTerm) {
        errors['deadline'] = T.translate("invoices.form.deadline_or_payment_required")
        errors['paymentTerm'] = T.translate("invoices.form.deadline_or_payment_required")
      }
      if (!data.step2.interestInArrears) {
        errors['interestInArrears'] = T.translate("invoices.form.intereset_in_arrears_required")
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateConversationInput: (data) => {
    let errors = {}

    if (!data.body) {
      errors['body'] = T.translate("conversations.form.body_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateChannelInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = T.translate("conversations.form.channel_name_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateAddUserInput: (data) => {
    let errors = {}

    if (!data.userId) {
      errors['userId'] = T.translate("conversations.form.user_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateConversationReplyInput: (data) => {
    let errors = {}

    if (!data.title) {
      errors['title'] = T.translate("conversations.form.title_required")
    }
    if (!data.body) {
      errors['body'] = T.translate("conversations.form.body_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateUserInvitationInput: (data) => {
    let errors = {}

    if (!data.email) {
      errors['email'] = T.translate("account.users.email_required")
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }

}  