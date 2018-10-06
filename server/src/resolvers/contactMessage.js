import nodemailer from 'nodemailer'
import Email from 'email-templates'
import sparkPostTransport from 'nodemailer-sparkpost-transport'

const transporter = nodemailer.createTransport(sparkPostTransport({
  'sparkPostApiKey': process.env.SPARKPOST_API_KEY,
  endpoint: "https://api.eu.sparkpost.com"
}))

export default {

  Mutation: {    
    
    createContactMessage: async (parent, args) => {
      const { name, email, messageBody } = args      

      const emailTemplate = new Email({
        message: {
          from: 'contact@email.toolsio.com', // Fix for sparkpost Unconfigured Sending Domain <gmail.com>
          to: 'support@gmail.com',
          subject: `Contact message from (${name})`,
          html: `<p>From: ${email}<p/><p>Message: ${messageBody}</p>`
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