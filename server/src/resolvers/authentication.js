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
        const account = await models.Account.findOne( { where: { subdomain } }, { raw: true })

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
          jwt.sign({
            id: response.user.dataValues.id,
            email: response.user.dataValues.email
          }, process.env.JWTSECRET1, { expiresIn: '60d' }, (err, emailToken) => {
            if (err) {
              console.log('err token: ', err)
            }
            
            const url = `http://${response.account.subdomain}.lvh.me:3000/login/confirmation/${emailToken}`

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
              .then('Email confirmation success': console.log)
              .catch('Email confirmation error', console.error)
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

    registerInvitedUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password, token } = args

      const { account } = jwt.verify(token, process.env.JWTSECRET1)

      try {
        const accountLocal = await models.Account.findOne( { where: { subdomain: account } }, { raw: true })

        if (accountLocal) {

          try {
            const user = await  models.User.schema(accountLocal.subdomain).create({ firstName, lastName, email, password }, { searchPath: accountLocal.subdomain })

            // Create emailToken
            jwt.sign({
              id: user.dataValues.id,
              email: user.dataValues.email
            }, process.env.JWTSECRET1, { expiresIn: '60d' }, (err, emailToken) => {
              if (err) {
                console.log('err token: ', err)
              }
              
              const url = `http://${accountLocal.dataValues.subdomain}.lvh.me:3000/login/confirmation/${emailToken}`

              transporter.sendMail({
                to: userCreated.get('email'),
                subject: 'Confirm Email (Toolsio)',
                html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
              })
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
    }

  }    
}