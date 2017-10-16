var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

import customer from'./customer'
import project from'./project'
import sale from'./sale'
import task from'./task'
import item from'./item'

let invoiceSchema = new Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: [true, "Customer is required."] },
  date_of_an_invoice: { type: Date, default: Date.now },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  paymentTerm: { type: Number, required: [true, "Payment term is required."] },
  interestInArrears: { type: Number, required: [true, "Interset in arrears is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "project", required: [true, "Project is required."] },
  sale: { type: mongoose.Schema.Types.ObjectId, ref: "sale", required: [true, "Sale is required."] },
  referenceNumber: { type: String, required: true },

  createdAt: { type: Date.now},
  updatedAt: {type: Date.now}
})

invoiceSchema.pre('save', function(next){
  now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})

invoiceSchema.pre('save', function (next) {
  this.referenceNumber = (this.sale.findById(this.sale).customer._id +' - '+ this.sale) ||
    (this.project.findById(this.project).customer._id +' - '+ this.project)
  next()
}) 

invoiceSchema.pre('validate', function(next) {
  if (this.deadline && this.payment_term) {
    next(Error('Only Deadline or Payment term should be filled, not both'))
  } else {
    next()
  }
})

invoiceSchema.pre('validate', function(next) {
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

let Invoice = module.exports = mongoose.model('invoice', invoiceSchema)

