import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Account Schema 
const accountSchema = mongoose.Schema({
  subdomain: { type: String, required: [true, "Subdomain is required."] }, 
  industry: { type: String, required: [true, "Industry is required."] },
  address: {
    street: { type: String },
    postalCode: { type: String },
    region: { type: String },
    country: { type: String }
  },
  contact: {
    phoneNumber: { type: String, match: [/\d{6,14}/, "Wrong Phone number fromat."] },
    email: { type: String, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Wrong Email fromat."] }
  },
  logo: { type: String }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

module.exports = mongoose.model('account', accountSchema)