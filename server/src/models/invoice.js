export default (sequelize, DataTypes) => {
  var Invoice = sequelize.define('invoices', {
    deadline: {
      type: DataTypes.DATE,
      allowNull : true,
      validate: {     
        isDate: true              // only allow date strings
      } 
    },
    paymentTerm: {
      type: DataTypes.INTEGER,
      allowNull : true, 
      validate: {    
        isInt: true,              // checks for int
      }, 
      field: 'payment_term',
    },
    interestInArrears: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {     
        isInt: true               // checks for int
      },
      field: 'interest_in_arrears'
    },
    status: {
      type: DataTypes.STRING,
      allowNull : false,
      defaultValue : "new",
      validate: {     
        notEmpty: true            // don't allow empty strings
      } 
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull : false,
      field: 'reference_number'
    },
    description: DataTypes.TEXT,
    tax: {
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
      beforeCreate: (invoice) => {
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
        field: 'customer_id',
         allowNull: false
      },
      onDelete: 'cascade'
    })

    // 1:1
    Invoice.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        field: 'project_id'
      },
      onDelete: 'cascade'
    })

    // 1:1
    Invoice.belongsTo(models.Sale, {
      foreignKey: {
        name: 'saleId',
        field: 'sale_id'
      },
      onDelete: 'cascade'
    })

    // 1:M
    Invoice.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false
      },
    })
  }

  return Invoice
}

// function deadlinePaymentTermValidator() {
//   if (this.deadline && this.paymentTerm) {
//     return false
//   } else if (!this.deadline && !this.paymentTerm) {
//     return false
//   } else {
//     return true
//   }
// }


