import nodemailer from "nodemailer";
import Email from "email-templates";
import sendgridTransport from "nodemailer-sendgrid-transport";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

export default {
  Mutation: {
    createContactMessage: async (parent, args) => {
      const { name, email, messageBody } = args;

      const emailTemplate = new Email({
        message: {
          from: "contact@toolsio.com",
          to: "support@gmail.com",
          subject: `Contact message from (${name})`,
          html: `<p>From: ${email}<p/><p>Message: ${messageBody}</p>`
        },
        // uncomment below to send emails in development/test env:
        send: true,
        // transport: {
        //   jsonTransport: true
        // }
        transport: transporter
      });

      return emailTemplate
        .send()
        .then(res => {
          console.log("Contact email success: ", {
            message: res.message,
            from: res.originalMessage.from,
            to: res.originalMessage.to,
            subject: res.originalMessage.subject,
            text: res.originalMessage.text
          });

          return {
            success: true
          };
        })
        .catch(err => {
          console.error("Contact email error: ", err);
          return {
            success: false,
            error: err
          };
        });
    }
  }
};
