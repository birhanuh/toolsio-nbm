import { formatErrors } from "../utils/formatErrors";
import requiresAuth from "../middlewares/authentication";
import sendgridTransport from "nodemailer-sendgrid-transport";

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import Email from "email-templates";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

export default {
  Query: {
    getInvitedUsers: requiresAuth.createResolver(
      (_, __, { models, subdomain }) =>
        models.Invitation.findAll({ searchPath: subdomain })
    )
  },

  Mutation: {
    sendInvitation: requiresAuth.createResolver(
      async (_, args, { models, subdomain, user }) => {
        let emailToken;

        try {
          // Create emailToken
          emailToken = jwt.sign(
            {
              email: args.email,
              account: subdomain
            },
            process.env.JWTSECRET1,
            { expiresIn: "60d" }
          );
        } catch (err) {
          console.log("err", err);
        }

        const url = `${process.env.CLIENT_PROTOCOL}${subdomain}.${process.env.CLIENT_HOST}/signup/invitation/?token=${emailToken}`;

        const email = new Email({
          message: {
            from: "no-replay@toolsio.com"
          },
          // uncomment below to send emails in development/test env:
          //send: true,
          // transport: {
          //   jsonTransport: true
          // }
          transport: transporter
        });

        if (args.email === user.dataValues.email) {
          return {
            success: false,
            errors: [
              {
                path: "email",
                message: "Email must be diffirent than the inviter."
              }
            ]
          };
        } else {
          const invitation = await models.Invitation.create(
            { email: args.email, userId: user.id },
            { searchPath: subdomain }
          )
            .then(res => res)
            .catch(err => err);

          if (
            invitation.errors &&
            (process.env.NODE_ENV !== "test" ||
              process.env.NODE_ENV !== "test_ci")
          ) {
            console.log("Invitation create err: ", invitation.errors);
            return {
              success: false,
              errors: formatErrors(invitation, models)
            };
          } else {
            return email
              .send({
                template: "user_invitation",
                message: {
                  to: args.email,
                  subject: "Complete your Registration (Toolsio)"
                },
                locals: {
                  account: subdomain,
                  email: args.email,
                  inviter: user.firstName,
                  invitationLink: url
                }
              })
              .then(res => {
                console.log("User invitation success: ", {
                  message: res.message,
                  from: res.originalMessage.from,
                  to: res.originalMessage.to,
                  subject: res.originalMessage.subject
                  //text: res.originalMessage.text
                });

                // Retrun success true to client on success
                return {
                  success: true
                };
              })
              .catch(err => {
                console.log("User invitation success: ", err);
                return {
                  success: false,
                  errors: err
                };
              });
          }
        }
      }
    )
  }
};
