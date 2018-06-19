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
    createContactMessage: async (parent, args, { models }) => {

      const { name, email, messageBody } = args
      console.log('args ', args)
      try {
        transporter.sendMail({
          to: 'k204510@nwytg.com',
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