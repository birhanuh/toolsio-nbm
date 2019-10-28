export default (sequelize, DataTypes) => {
  const Item = sequelize.define("items", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true // checks for int
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true // checks for any numbers
      },
      field: "unit_price"
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        isDecimal: true //  checks for any numbers
      }
    }
  });

  Item.associate = models => {
    // 1:M
    Item.belongsTo(models.Sale, {
      foreignKey: {
        name: "saleId",
        field: "sale_id",
        allowNull: false
      },
      onDelete: "cascade"
    });

    // 1:M
    Item.belongsTo(models.Invoice, {
      through: models.Sale,
      foreignKey: {
        name: "saleId",
        field: "sale_id",
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Item;
};
