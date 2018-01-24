import mongoose from 'mongoose'

import Customer from'./customer'
import Project from'./project'
import Sale from'./sale'
import Task from'./task'
import Item from'./item'

const invoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: [true, "Customer is required."] },
  deadline: { type: Date, validate: { validator: deadlinePaymentTermValidator, message: 'Select either Deadline or Payment term.'} },
  paymentTerm: { type: Number, validate: { validator: deadlinePaymentTermValidator, message: 'Select either Deadline or Payment term.'} },
  interestInArrears: { type: Number, required: [true, "Interset in arrears is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: "project", validate: { validator: saleProjectValidator, message: 'Select either Sale or Project.'} },
  sale: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: "sale", validate: { validator: saleProjectValidator, message: 'Select either Sale or Project.'} },
  referenceNumber: { type: String, required: true },
  total: { type: Number, default: 0 }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

invoiceSchema.pre('validate', async function(next) {

  if (this.sale) {
    let sale = await getSaleById(this.sale)

    this.customer = sale.customer
    this.referenceNumber = this.sale +'-'+ this.customer 
    this.total = sale.total
  } 

  if (this.project) {    
    let project = await getProjectById(this.project)
  
    this.customer = project.customer
    this.referenceNumber = this.project +'-'+ this.customer
    this.total = project.total
  }

  // Set initial value
  this.status = "new"
  
  next()
})

invoiceSchema.post('save', function(doc, next) {
  
  // Push invoice to related Customer object
  Customer.findByIdAndUpdate(this.customer, { $push: { invoices: this._id }}, { new: true }, (err, customer) => {
    if (err) {
      errors: {
        cantUpdateCustomer: {
          message: err
        } 
      }
    }
  })

  // Push Invoice to related Sale object
  Sale.findByIdAndUpdate(this.sale, { invoice: this._id }, { new: true }, (err, sale) => {
    if (err) {
      errors: {
        cantUpdateSale: {
          message: err
        } 
      }
    }
  })

  // Push Invoice to related Projectr object
  Project.findByIdAndUpdate(this.project, { invoice: this._id }, { new: true }, (err, project) => {
    if (err) {
      errors: {
        cantUpdateProject: {
          message: err
        } 
      }
    }
  })

  next()
})

let getSaleById = (id) => {
  return Sale.findById(id)
}

let getProjectById = (id) => {
  return Project.findById(id)
}

function saleProjectValidator() {
  if (this.sale && this.project) {
    return false
  } else if (this.sale && !this.project) {
    this.project = null
    return true
  } else if (!this.sale && this.project) {
    this.sale = null
    return true
  } else {
    return true
  }
}

function deadlinePaymentTermValidator() {
  if (this.deadline && this.paymentTerm) {
    return false
  } else if (!this.deadline && !this.paymentTerm) {
    return false
  } else {
    return true
  }
}

invoiceSchema.methods.allUnpaidInvoicesByStatus = () => {

}

invoiceSchema.methods.unpaidInvoicesByInvitedUsers = () => {

}

invoiceSchema.index({customer: 'text', 'deadline': 'text', 'project.name': 'text', 'sale.name': 'text'})

module.exports = mongoose.model('invoice', invoiceSchema)

