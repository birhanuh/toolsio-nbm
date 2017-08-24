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
  billed: { type: Boolean, required: true, default: false },

  createdAt: Date,
  updatedAt: Date
})

customerSchema.pre('validate', function(next) {
  if (this.deadline && this.payment_term) {
    next(Error('Only Deadline or Payment term should be filled, not both'))
  } else {
    next()
  }
})

customerSchema.pre('validate', function(next) {
  if (this.project && this.sale) {
    next(Error('Only Project or Sale should be selected, not both'))
  } else {
    next()
  }
})

invoiceSchema.methods.allUnpaidInvoicesByStatus = function() {
}

invoiceSchema.methods.unpaidInvoicesByInvitedUsers = function() {
}

let Invoice = module.exports mongoose.model('Invoice', invoiceSchema)