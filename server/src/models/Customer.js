import mongoose from 'mongoose'
     
let customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: String
  },
  vatNumber: { type: String, required: true },
  contact: {
    phoneNumber: { type: String},
    email: { type: String}
  },
  includeContactOnInvoice: { type: Boolean, required: true, default: false }
})
 
customerSchema.pre('validate', function(next) {
  if (!this.contact.phoneNumber && !this.contact.email) {
    next(Error('Either Phone number or email should be filled'))
  } else {
    next()
  }
})

let Customer = mongoose.model('Customer', customerSchema)