export default (sequelize, DataTypes) => {
  var Invoice = sequelize.define('invoices', {
    deadline: {
      type: DataTypes.DATE
    },
    payment_term: {
      type: DataTypes.INTEGER
    },
    interest_in_arrears: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    status: {
      type: DataTypes.STRING,
      allowNull : false
    },
    reference_number: {
      type: DataTypes.DOUBLE,
      allowNull : false
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.INTEGER,
      allowNull : false
    }
  })

  Invoice.associate = (models) => {
    // 1:M
    Invoice.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
      }
    })

  }

  return Invoice
}



// invoiceSchema.pre('validate', async function(next) {

//   if (this.sale) {
//     let sale = await getSaleById(this.sale)

//     this.customer = sale.customer
//     this.referenceNumber = this.sale +'-'+ this.customer 
//     this.total = sale.total
//   } 

//   if (this.project) {    
//     let project = await getProjectById(this.project)
  
//     this.customer = project.customer
//     this.referenceNumber = this.project +'-'+ this.customer
//     this.total = project.total
//   }

//   // Set initial value
//   this.status = "new"
  
//   next()
// })

// invoiceSchema.post('save', function(doc, next) {
  
//   // Push invoice to related Customer object
//   Customer.findByIdAndUpdate(this.customer, { $push: { invoices: this._id }}, { new: true }, (err, customer) => {
//     if (err) {
//       errors: {
//         cantUpdateCustomer: {
//           message: err
//         } 
//       }
//     }
//   })

//   // Push Invoice to related Sale object
//   Sale.findByIdAndUpdate(this.sale, { invoice: this._id }, { new: true }, (err, sale) => {
//     if (err) {
//       errors: {
//         cantUpdateSale: {
//           message: err
//         } 
//       }
//     }
//   })

//   // Push Invoice to related Projectr object
//   Project.findByIdAndUpdate(this.project, { invoice: this._id }, { new: true }, (err, project) => {
//     if (err) {
//       errors: {
//         cantUpdateProject: {
//           message: err
//         } 
//       }
//     }
//   })

//   next()
// })

// let getSaleById = (id) => {
//   return Sale.findById(id)
// }

// let getProjectById = (id) => {
//   return Project.findById(id)
// }

// function saleProjectValidator() {
//   if (this.sale && this.project) {
//     return false
//   } else if (this.sale && !this.project) {
//     this.project = null
//     return true
//   } else if (!this.sale && this.project) {
//     this.sale = null
//     return true
//   } else {
//     return true
//   }
// }

// function deadlinePaymentTermValidator() {
//   if (this.deadline && this.paymentTerm) {
//     return false
//   } else if (!this.deadline && !this.paymentTerm) {
//     return false
//   } else {
//     return true
//   }
// }


