export default (sequelize, DataTypes) => {
  const Sale = sequelize.define("sales", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true // only allow date strings
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    description: DataTypes.TEXT,
    tax: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        isDecimal: true //  checks for any numbers
      }
    },
    isInvoiced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_invoiced"
    }
  });

  Sale.associate = models => {
    // 1:N
    Sale.belongsTo(models.Customer, {
      foreignKey: {
        name: "customerId",
        field: "customer_id",
        allowNull: false
      },
      onDelete: "cascade"
    });

    // 1:M
    Sale.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
        allowNull: false
      }
    });
  };

  return Sale;
};
