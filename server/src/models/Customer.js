import mongoose from 'mongoose'
     
let customerSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  address: {
    street: { type: String, required: [true, "Street is required."] },
    postalCode: { type: String, required: [true, "Postal code is required."] },
    region: { type: String, required: [true, "Region is required."] },
    country: { type: String, required: [true, "Country is required."] }
  },
  vatNumber: { type: String, required: [true, "Vat number is required."] },
  contact: {
    phoneNumber: { type: String, validate: { validator: contactValidator, message: 'Either Phone number or email should be filled.'} },
    email: { type: String, validate: { validator: contactValidator, message: 'Either Phone number or email should be filled.'} }
  },
  includeContactOnInvoice: { type: Boolean, default: false }
})
 
function contactValidator() {
  if (this.contact.phoneNumber === '' && this.contact.email === '') {
    return false
  } else {
    return true
  }

}

let Customer = module.exports = mongoose.model('Customer', customerSchema)
