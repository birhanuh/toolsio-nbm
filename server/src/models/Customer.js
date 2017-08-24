import mongoose from 'mongoose'
     
let customerSchema = new mongoose.Schema({
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
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }]
})
 
function contactValidator() {
  if (this.contact.phoneNumber === '' && this.contact.email === '') {
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

let Customer = module.exports = mongoose.model('Customer', customerSchema)
