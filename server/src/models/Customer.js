import mongoose from 'mongoose'
     
const customerSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  address: {
    street: { type: String, required: [true, "Street is required."] },
    postalCode: { type: String, required: [true, "Postal code is required."] },
    region: { type: String, required: [true, "Region is required."] },
    country: { type: String, required: [true, "Country is required."] }
  },
  vatNumber: { type: String, required: [true, "Vat number is required."], unique: true },
  contact: {
    phoneNumber: { type: String, match: [/\d{6,14}/, "Wrong Phone number fromat."], validate: { validator: contactValidator, message: 'Either Phone number or email should be filled.'} },
    email: { type: String, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Wrong Email fromat."], validate: { validator: contactValidator, message: 'Either Phone number or email should be filled.'} }
  },
  includeContactOnInvoice: { type: Boolean, default: false },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "sale" }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "invoice" }],

  createdAt: { type: Date },
  updatedAt: {type: Date }
})
 
function contactValidator() {
  if (!this.contact.phoneNumber  && !this.contact.email) {
    return false
  } else if (this.contact.phoneNumber  && this.contact.email) {
    return false
  } else {
    return true
  }
}

customerSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    let message = {
      errors: {
        vatNumber: {
          message: 'Vat number must be unique.'
        } 
      }
    }
    next(message)
  } else {
    next(error)
  }
})

customerSchema.index({name: 'text', 'address.street': 'text', 'address.postalCode': 'text', 'address.region': 'text', 'address.country': 'text', 'contact.phoneNumber': 'text', 'contact.email': 'text'})

module.exports = mongoose.model('customer', customerSchema)
