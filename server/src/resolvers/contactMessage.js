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
    
    createContactMessage: async (parent, args) => {
      const { name, email, messageBody } = args      

      const emailTemplate = new Email({
        message: {
          from: email,
          to: 'support@toolsio.com',
          subject: `Contact message from (${name})`,
          html: messageBody
        },
        // uncomment below to send emails in development/test env:
        send: true,
        // transport: {
        //   jsonTransport: true
        // }
        transport: transporter
      })

      return emailTemplate
        .send()
        .then(res => {
            return{
              success: true
            }
          })
        .catch(err => {
            console.error('Email confirmation error: ', err)
            return {
              success: false,
              error: err
            }
          })
    }
        
  }    
}