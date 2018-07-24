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
        isEmail: {                    // checks for email format (foo@bar.com) 
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
      beforeCreate: (user) => {
        return new Promise(function(resolve, reject) {
       
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
      },
      beforeBulkUpdate: async (user) => {
        if (!user.attributes.password) return

        return new Promise(function(resolve, reject) {
      
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) return reject(err)

            // hash the password using our new salt
            return bcrypt.hash(user.attributes.password, salt, null, (err, hash) => {
              if (err) return reject(err)
             
              // override the cleartext password with the hashed one
              user.attributes.password = hash
              resolve(hash)
            })
          })
        })
      }
    },

    comparePassword: (candidatePassword, hash, callback) => {
      bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err
        callback(null, isMatch)
      })
    }
  }, { underscored: true })

  User.associate = (models) => {
    // N:M
    User.belongsToMany(models.Channel, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      },
      constraints: false
    })
  }

  return User
}