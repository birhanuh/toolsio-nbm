import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

// Localization 
import T from 'i18n-react'

export default {

  validateRegistrationInput: (data) => {
    let errors = {}

    if (!data.user.email) {
      errors["email"] = {
        message: T.translate("log_in.email_required")
      }
    } else {
      if (!Validator.isEmail(data.user.email)) {
        errors["email"] = {
          message: T.translate("sign_un.email_format_required") 
        } 
      }
    }  
    if (!data.user.password) {
      errors["password"] = {
        message: T.translate("sign_up.password_required")
      } 
    }
    if (!data.user.confirmPassword) {
      errors["confirmPassword"] = {
        message: T.translate("sign_up.password_confirmation_required")
      }
    }
    if (data.user.password && data.confirmPassword) {
      if (!Validator.equals(data.password, data.confirmPassword)) {
        errors["confirmPassword"] = {
          message: T.translate("sign_up.password_match_required")
        } 
      }
    }    
    if (!data.account.subdomain) {
      errors["subdomain"] = {
        message: T.translate("sign_up.account.subdomain_required")
      }
    }
    if (!data.account.industry) {
      errors["industry"] = {
        message: T.translate("sign_up.account.industry_required")
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
        message: T.translate("log_in.email_required")
      }
    }
    if (!data.password) {
      errors["password"] = {
        message: T.translate("log_in.password_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateSubdomainInput: (data) => {
    let errors = {}

    if (!data.subdomain) {
      errors["subdomain"] = {
        message: T.translate("log_in.subdomain.subdomain_required")
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
        message: T.translate("projects.form.name_required")
      }
    }
    if (!data.deadline) {
      errors['deadline'] = {
        message: T.translate("projects.form.deadline_required")
      }
    }
    if (!data.customer) {
      errors['customer'] = {
        message: T.translate("projects.form.customer_required")
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
        message: T.translate("sales.form.name_required")
      }
    }
    if (!data.deadline) {
      errors['deadline'] = {
        message: T.translate("sales.form.deadline_required")
      }
    }
    if (!data.customer) {
      errors['customer'] = {
        message: T.translate("sales.form.customer_required")
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
        message: T.translate("projects.tasks.form.name_required")
      }
    }
    if (!data.paymentType) {
      errors['paymentType'] = {
        message: T.translate("projects.tasks.form.payment_type_required")
      }
    }
    if (!data.hours) {
      errors['hours'] = {
        message: T.translate("projects.tasks.form.hours_required")
      }
    }
    if (!data.price) {
      errors['price'] = {
        message: T.translate("projects.tasks.form.price_required")
      }
    }
    if (!data.vat) {
      errors['vat'] = {
        message: T.translate("projects.tasks.form.vat_required")
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
        message: T.translate("sales.items.form.name_required")
      }
    }
    if (!data.unit) {
      errors['unit'] = {
        message: T.translate("sales.items.form.unit_required")
      }
    }
    if (!data.quantity) {
      errors['quantity'] = {
        message: T.translate("sales.items.form.quantity_required")
      }
    }
    if (!data.price) {
      errors['price'] = {
        message: T.translate("sales.items.form.price_required")
      }
    }
    if (!data.vat) {
      errors['vat'] = {
        message: T.translate("sales.items.form.vat_required")
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateCustomerInput: (data) => {
    let errors = {}

    if (!data.name) {
      errors['name'] = {
        message: T.translate("customers.form.name_required")
      }
    }
    if (!data.contact.phoneNumber && !data.contact.email) {
      errors['phoneNumber'] = {
        message: T.translate("customers.form.phone_number_or_email_required")
      }
       errors['email'] = {
        message: T.translate("customers.form.phone_number_or_email_required")
      }
    }
    if (!data.address.street) {
      errors['street'] = {
        message: T.translate("customers.form.street_required")
      }
    }
    if (!data.address.postalCode) {
      errors['postalCode'] = {
        message: T.translate("customers.form.postal_code_required")
      }
    }
    if (!data.address.region) {
      errors['region'] = {
        message: T.translate("customers.form.region_required")
      }
    }
    if (!data.address.country) {
      errors['country'] = {
        message: T.translate("customers.form.country_required")
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateInvoiceInput: (data) => {
    let errors = {}
    
    if (data.currentStep === 'step1') {
      if ((!data.step1.sale && !data.step1.project) || (data.step1.sale && data.step1.project)) {
        errors['sale'] = {
          message: T.translate("invoices.form.sale_or_project_required")
        }
         errors['project'] = {
          message: T.translate("invoices.form.sale_or_project_required")
        }
      }      
    }

    if (data.currentStep === 'step2') {
      if (!data.step2.deadline && !data.step2.paymentTerm) {
        errors['deadline'] = {
          message: T.translate("invoices.form.deadline_or_payment_required")
        }
        errors['paymentTerm'] = {
          message: T.translate("invoices.form.deadline_or_payment_required")
        }
      }
      if (!data.step2.interestInArrears) {
        errors['interestInArrears'] = {
          message: T.translate("invoices.form.intereset_in_arrears_required")
        }
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  },

  validateConversationInput: (data) => {
    let errors = {}

    if (!data.recipientId) {
      errors['recipientId'] = {
        message: T.translate("conversations.form.recipient_required")
      }
    }
    if (!data.title) {
      errors['title'] = {
        message: T.translate("conversations.form.title_required")
      }
    }
    if (!data.body) {
      errors['body'] = {
        message: T.translate("conversations.form.body_required")
      }
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }

}  