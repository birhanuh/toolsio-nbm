export default (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      } 
    },
    unit: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      } 
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {     
        isInt: true, // checks for int
      } 
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull : false,
      validate: {     
        isDecimal: true, // checks for any numbers
      } 
    },
    vat: {
      type: DataTypes.INTEGER, 
      allowNull : true,
      validate: {    
        isInt: true // checks for int
      } 
    }
  }, {
    hooks: {
      beforeValidate: (item, options) => {
        if (item.vat === "") {
          item.vat = null
        }
      }
    }
  })

  Item.associate = (models) => {
    // 1:n
    Item.belongsTo(models.Sale, {
      foreignKey: {
        name: 'saleId',
        field: 'sale_id'
      }
    })
  }

  return Item
}

//   // Push items and increment total to related Sale object
//   Sale.findByIdAndUpdate(this._creator, { $push: {items: this._id}, $inc: {total: this.price} }, { new: true }, (err, sale) => {
//     if (err) {
//       errors: {
//         cant_update_sale: {
//           message: err
//         } 
//       }
//     }
//   })

//   next()
// })


