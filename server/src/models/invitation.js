export default (sequelize, DataTypes) => {
  const Invitation = sequelize.define(
    "invitations",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            // checks for email format (foo@bar.com)
            arg: true,
            msg: "Invalid email format"
          }
        }
      },
      isInvitationAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_invitation_accepted"
      }
    },
    { underscored: true }
  );

  Invitation.associate = models => {
    // 1:M
    Invitation.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Invitation;
};
