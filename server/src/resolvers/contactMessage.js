import nodemailer from 'nodemailer'

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
   
      try {
        transporter.sendMail({
          to: email,
          subject: `Contact message from (${name})`,
          html: messageBody
        })
    
        return {
          success: true
        }
      } catch(err) {
        console.log('err: ', err)
        return {
          success: false,
          error: err
        }       
      }
    }

  }    
}