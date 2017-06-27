var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

import task from'./Task'

let invoiceSchema = new Schema({
  customer: { type: ObjectId, required: true },
  date_of_an_invoice: { type: Date, default: Date.now, required: true },
  deadline: { type: Date, default: Date.now, required: true },
  payment_term: { type: Number },
  interest_in_arrears: { type: Number },
  status: { type: String, required: true },
  description: { type: String },
  project: { type: ObjectId },
  sale: { type: ObjectId },
  billed: { type: Boolean, required: true, default: false }
})
 
invoiceSchema.methods.allUnpaidInvoicesByStatus = function() {
}

invoiceSchema.methods.unpaidInvoicesByInvitedUsers = function() {
}

invoiceSchema.methods.xorDeadlinePaymentTerm = function() {
}

invoiceSchema.methods.xorSaleProject = function() {
}

let Invoice = module.exports mongoose.model('Invoice', invoiceSchema)