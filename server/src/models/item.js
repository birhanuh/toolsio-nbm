export default (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    name: {
      type: DataTypes.STRING,
      allowNull : false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull : false
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull : false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull : false
    },
    vat: DataTypes.INTEGER,
  })

  Item.associate = (models) => {
    // 1:M
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


