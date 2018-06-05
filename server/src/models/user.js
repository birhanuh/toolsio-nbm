import bcrypt from 'bcrypt-nodejs'
import Promise from 'bluebird'
const SALT_WORK_FACTOR = 10

export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false,
      validate: {     
        not: ["[0-9]",'i']            // will only allow numbers
      } 
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false,
      validate: {     
        not: ["[0-9]",'i']            // will only allow numbers
      } 
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {     
        isEmail: { // checks for email format (foo@bar.com) 
          arg: true,
          msg: 'Invalid email format'
        }
      } 
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        len: { 
          arg: [5, 100],
          msg: 'Password needs to be at least 5 characters'
        }
      }
    },
    avatarUrl: {
      type: DataTypes.STRING,
      field: 'avatar_url'
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      field: 'is_confirmed'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      field: 'is_admin'
    }
  }, {
    hooks: {
      beforeValidate: (user) => {
        user.isAdmin = user.length === 0
        user.isConfirmed = user.length === 0
      },
      beforeCreate: (user) => {
        return new Promise(function(resolve, reject) {

          // only hash the password if it has been modified (or is new)
          if (!user.changed('password')) return 
      
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) return reject(err)

            // hash the password using our new salt
            return bcrypt.hash(user.password, salt, null, (err, hash) => {
              if (err) return reject(err)
             
              // override the cleartext password with the hashed one
              user.password = hash
              resolve(hash)
            })
          })
        })
      }
    }
  }, { underscored: true })

  User.associate = (models) => {
    // N:M
    User.belongsToMany(models.Channel, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    })
  }

  User.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    })
  }

  return User
}