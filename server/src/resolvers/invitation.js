import { formatErrors } from '../utils/formatErrors'
import requiresAuth from '../middlewares/authentication'

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
  Query: {
    getInvitedUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.Invitation.findAll({ searchPath: subdomain }))
  },

  Mutation: {
    sendInvitation: requiresAuth.createResolver(async (parent, args, { user, models, subdomain }) => {
     
      let emailToken

      try {
        // Create emailToken
        emailToken = jwt.sign({
          email: args.email,
          account: subdomain
        }, process.env.JWTSECRET1, { expiresIn: '60d' })
      } catch(err) {
        console.log('err', err)
      }

      const url = `http://${subdomain}.lvh.me:3000/signup/invitation/?token=${emailToken}`
      
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

      return email
        .send({
          template: 'user_invitation',
          message: {
            to: args.email,
            subject: 'Complete your Registration (Toolsio)'
          },
          locals: {
            account: subdomain,
            email: args.email,
            inviter: user.firstName,
            invitationLink: url,
          }
        })
        .then(res => {
          console.log('User invitation success: ', res)

          models.Invitation.create({email: args.email, userId: user.id}, { searchPath: subdomain })
            .then(() => console.log('Invitation create success'))
            .catch(err => {
              console.log('Invitation create err: ', err)
              return {
                success: false,
                errors: formatErrors(err, models)
              }
            })

          // Retrun success true to client on success
          return {
            success: true
          }
        })
        .catch(err => {
          console.log('User invitation success: ', err)
          return {
            success: false, 
            errors: err
          }
        })          
    })
    
  }    
}