import { formatErrors } from '../utils/formatErrors'
import { loginUserWithToken } from '../utils/authentication'

// Loadash
import map from 'lodash/map'

import jwt from 'jsonwebtoken'

import nodemailer from 'nodemailer'
import Email from 'email-templates'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export default {
  Mutation: {
    loginUser: (parent, { email, password }, { models, subdomain, SECRET, SECRET2 }) => 
      loginUserWithToken(email, password, models, subdomain, SECRET, SECRET2),
    
    registerUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password } = args
      const { subdomain, industry } = args

      try {
        const account = await models.Account.findOne({ where: { subdomain } }, { raw: true })

        if (account) {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: 'Subdomain is already taken'
              }
            ]
          }
        } else {
          const response = await models.sequelize.transaction(async (transaction) => {
            
            // Create a schema
            await models.sequelize.createSchema(subdomain)

            // Migrate users model 
            await models.User.sync({schema: subdomain})
            
            // Count users
            const count = await models.User.count({ searchPath: subdomain, transaction })
       
            const user = await  models.User.create({ firstName, lastName, email, password, isAdmin: !count }, { searchPath: subdomain, transaction })
        
            const account = await models.Account.create({ subdomain, industry, owner: user.dataValues.id }, { transaction })

            // Sync the reset schemas asynchronously
            map(Object.keys(models), (key) => {
                if (['sequelize', 'Sequelize', 'Account', 'User'].includes(key)) return
                models[key].sync({schema: subdomain})
              })

            return { user, account } 
          })

          // Create emailToken
          process.env.NODE_ENV !== 'test' && jwt.sign({
              id: response.user.dataValues.id,
              email: response.user.dataValues.email
            }, process.env.JWTSECRET1, { expiresIn: '60d' }, (err, emailToken) => {
              if (err) {
                console.log('err token: ', err)
              }
              
              const url = `http://${response.account.subdomain}.lvh.me:3000/login/confirmation/?token=${emailToken}`

              const email = new Email({
                message: {
                  from: 'no-replay@toolsio.com'
                },
                // uncomment below to send emails in development/test env:
                send: true,
                // transport: {
                //   jsonTransport: true
                // }
                transport: transporter
              })

              email
                .send({
                  template: 'email_confirmation',
                  message: {
                    to: response.user.dataValues.email,
                    subject: 'Confirm your Email (Toolsio)'
                  },
                  locals: {
                    firstName: response.user.dataValues.firstName,
                    confirmationLink: url,
                  }
                })
                .then(res => console.log('Email confirmation success: ', res))
                .catch(err => console.error('Email confirmation error: ', err))
            })
      
          return {
            success: true,
            account: response.account
          }
        }
      } catch(err) {
        console.log('err: ', err)
        
        // Drop a schema
        models.sequelize.dropSchema(subdomain)

        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }
    },

    isSubdomainExist: (parent, { subdomain }, { models }) => 
      models.Account.findOne({ where: { subdomain } }, { raw: true })
        .then(account => {
          if (account) {
            return {
              success: true,
              subdomain: account.dataValues.subdomain
            }
          } else {
            return {
              success: false,
              errors: [{ path: 'subdomain', message: 'There is no account with such subdomain! Go to Sign up page to sign for free!'}]
            }
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models) 
          }
        }),

    registerInvitedUser: async (parent, { firstName, lastName, email, password, token }, { models }) => {
      const { account } = jwt.verify(token, process.env.JWTSECRET1)

      try {
        const accountLocal = await models.Account.findOne({ where: { subdomain: account } }, { raw: true })

        if (accountLocal) {

          try {
            models.User.create({ firstName, lastName, email, password, isConfirmed: true }, { searchPath: accountLocal.subdomain })
              .catch(err => {
                console.log('Invited user registration: ', err)
              })

            // Set isInvitaitonAccepted to true
            models.Invitation.update({isInvitationAccepted: true}, { where: { email }, returning: true, plain: true, searchPath: accountLocal.subdomain })
              .then(() => console.log('Invitation update success'))
              .catch(err => {
                console.log('Invitation create err: ', err)
                return {
                  success: false,
                  errors: formatErrors(err, models)
                }
              })

            return {
              success: true,
              account: accountLocal
            }
          } catch(err) {
            console.log('err: ', err)
            return {
              success: false,
              errors: formatErrors(err, models)
            }       
          }
        } else {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: `Account *${account}* to which you are invited doesn't exist. You can create it as your own new account by going to sign up page`
              }
            ]
          }
        }
      } catch(err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }
    },

    forgotPasswordResetRequest: async (parent, { email }, { models, subdomain }) => {
      try {
        const account = await models.Account.findOne({ where: { subdomain } }, { raw: true })

        if (!account) {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: `Account ${subdomain} doesn't exist`
              }
            ]
          }
        } else {
         
          const user = await  models.User.findOne({ where: { email }, searchPath: subdomain })        
   
          if (user) {
            // Create forgotPasswordResetRequestToken
            jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email,
                subdomain: account.dataValues.subdomain
              }, process.env.JWTSECRET1, { expiresIn: '60d' }, (err, forgotPasswordResetRequestToken) => {
                if (err) {
                  console.log('err token: ', err)
                }
                
                const url = `http://${account.subdomain}.lvh.me:3000/login/password-reset/?token=${forgotPasswordResetRequestToken}`

                const email = new Email({
                  message: {
                    from: 'no-replay@toolsio.com'
                  },
                  // uncomment below to send emails in development/test env:
                  send: true,
                  // transport: {
                  //   jsonTransport: true
                  // }
                  transport: transporter
                })

                email
                  .send({
                    template: 'reset_password',
                    message: {
                      to: user.dataValues.email,
                      subject: 'Password reset (Toolsio)'
                    },
                    locals: {
                      firstName: user.dataValues.firstName,
                      passwordResetLink: url,
                    }
                  })
                  .then(res => console.log('Password confirmation success: ', res))
                  .catch(err => console.error('Password confirmation error: ', err))
              })
            
            return {
              success: true
            }
          } else {
 
            return {
              success: false,
              errors: [
                {
                  path: 'subdomain',
                  message: `You don't have credentials on (${subdomain}) account`
                }
              ]
            }
          }
        }
      } catch(err) {
        console.log('err: ', err)

        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }
    },

    passwordReset: async (parent, { password, token }, { models }) => {
      try {
        const { email, subdomain } = jwt.verify(token, process.env.JWTSECRET1)

        const account = await models.Account.findOne({ where: { subdomain: subdomain } }, { raw: true })

        if (!account) {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: `Account ${subdomain} doesn't exist`
              }
            ]
          }
        } else {
          
          return models.User.update({ password }, { where: {email: email}, returning: true, plain: true, searchPath: account.subdomain })
            .then(() => {  
              return {
                success: true
              }
            })
            .catch(err => {
              console.log('err: ', err)
              return {
                success: false,
                errors: formatErrors(err, models)
              }
            })
     
        }
      } catch(err) {
        console.log('err: ', err)

        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }
    },

    confirmUserEmail: async (parent, { token }, { models, subdomain }) => {
      try {
        const { email } = jwt.verify(token, process.env.JWTSECRET1)

        const user = await models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })

        if (user.isConfirmed) {
          return {
            success: false,
            errors: [
              {
                path: 'message',
                message: `Your email is already confirmed`
              }
            ]
          }
        } else {
          
          return models.User.update({ isConfirmed: true }, { where: {email: email}, returning: true, plain: true, searchPath: subdomain })
            .then(() => {  
              return {
                success: true
              }
            })
            .catch(err => {
              console.log('err: ', err)
              return {
                success: false,
                errors: formatErrors(err, models)
              }
            })
     
        }
      } catch(err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }
    }

  }    
}