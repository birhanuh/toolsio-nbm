export default (sequelize, DataTypes) => {
  var DirectMessage = sequelize.define(
    "direct_messages",
    {
      body: DataTypes.TEXT,
      uploadPath: {
        type: DataTypes.STRING,
        field: "upload_path"
      },
      mimetype: DataTypes.STRING,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_read"
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      }
    },
    {
      indexes: [{ fields: ["created_at"] }]
    }
  );

  DirectMessage.associate = function(models) {
    // 1:M
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id",
        allowNull: false
      }
    });

    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: "senderId",
        field: "sender_id",
        allowNull: false
      }
    });
  };

  return DirectMessage;
};
