export default (sequelize, DataTypes) => {
  const Task = sequelize.define("tasks", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      }
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true // don't allow empty strings
      },
      field: "payment_type"
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

  Task.associate = models => {
    // 1:M
    Task.belongsTo(models.Project, {
      foreignKey: {
        name: "projectId",
        field: "project_id",
        allowNull: false
      },
      onDelete: "cascade"
    });

    // 1:M
    Task.belongsTo(models.Invoice, {
      through: models.Project,
      foreignKey: {
        name: "projectId",
        field: "project_id",
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Task;
};
