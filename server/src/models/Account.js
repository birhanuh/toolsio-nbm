import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let Schema = mongoose.Schema

// Account Schema 
const accountSchema = new Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sudomain: { type: String, required: [true, "Subdomain is required."] }, 
  industry: { type: String, required: [true, "Subdomain is required."] },
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
  logo: { data: Buffer, contentType: String },
  createdAt: Date,
  updatedAt: Date
})

function contactValidator() {
  if (this.contact.phoneNumber === '' && this.contact.email === '') {
    return false
  } else {
    return true
  }
}

let Account = module.exports = mongoose.model('Account', accountSchema)