export default (sequelize, DataTypes) => {
  var Invoice = sequelize.define('invoices', {
    deadline: {
      type: DataTypes.DATE,
      allowNull : true,
      validate: {     
        isDate: true // only allow date strings
      } 
    },
    paymentTerm: {
      type: DataTypes.INTEGER,
      allowNull : true, 
      validate: {    
        isInt: true, // checks for int
      }, 
      field: 'payment_term',
    },
    interestInArrears: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {     
        isInt: true // checks for int
      },
      field: 'interest_in_arrears'
    },
    status: {
      type: DataTypes.STRING,
      allowNull : false,
      defaultValue : "new",
      validate: {     
        notEmpty: true  // don't allow empty strings
      } 
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull : false,
      field: 'reference_number'
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.DECIMAL,
      allowNull : false,
      defaultValue : 0,
      validate: {     
        isDecimal: true,          // checks for any numbers
      } 
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  }, {
    hooks: {
      beforeValidate: (invoice, options) => {
        if (!invoice.deadline && !invoice.paymentTerm) {
          throw new Error("Either deadline or payment term is required")
        }
        if (invoice.deadline === "") {
          invoice.deadline = null
        }
        if (invoice.paymentTerm === "") {
          invoice.paymentTerm = null
        }
        if (!invoice.projectId && !invoice.saleId) {
          throw new Error("Either Project or Sale is required")
        }
      }
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

    // 1:1
    Invoice.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        field: 'project_id'
      }
    })

    // 1:1
    Invoice.belongsTo(models.Sale, {
      foreignKey: {
        name: 'saleId',
        field: 'sale_id'
      }
    })

    // 1:M
    Invoice.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
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


