import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let Schema = mongoose.Schema

// Account Schema 
const accountSchema = new Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  subdomain: { type: String, required: [true, "Subdomain is required."] }, 
  industry: { type: String, required: [true, "Industry is required."] },
  address: {
    street: { type: String },
    postalCode: { type: String },
    region: { type: String },
    country: { type: String }
  },
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

let Account = module.exports = mongoose.model('account', accountSchema)