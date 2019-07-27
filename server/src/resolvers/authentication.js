import bcrypt from "bcrypt-nodejs";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";
import Email from "email-templates";

import { formatErrors } from "../utils/formatErrors";
import sendgridTransport from "nodemailer-sendgrid-transport";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'dd4ofkhwikyxnp7o@ethereal.email',
//         pass: 'FYTjzVtJGqMPAEfdAg'
//     }
// });

export default {
  Query: {
    getCurrentAccount: async (_, __, { models, req, subdomain }) => {
      const account = await models.Account.findOne(
        { where: { subdomain } },
        { raw: true }
      );

      if (account) {
        if (req.session.userId) {
          return models.User.findOne(
            { where: { id: req.session.userId }, searchPath: subdomain },
            { raw: true }
          )
            .then(user => {
              if (user) {
                return {
                  success: true,
                  user,
                  subdomain
                };
              } else {
                return {
                  success: false
                };
              }
            })
            .catch(err => {
              console.log("err: ", err);
              return {
                success: false,
                errors: formatErrors(err)
              };
            });
        } else {
          return {
            success: false,
            errors: `User id not found.`
          };
        }
      } else {
        return {
          success: false,
          errors: `Schema ${subdomain} doesn't exist.`
        };
      }
    }
  },

  Mutation: {
    // loginUser: (parent, { email, password }, { models, subdomain, SECRET, SECRET2 }) =>
    //   loginUserWithToken(email, password, models, subdomain, SECRET, SECRET2),

    loginUser: async (_, { email, password }, { models, subdomain, req }) => {
      const user = await models.User.findOne(
        { where: { email }, searchPath: subdomain },
        { raw: true }
      );

      if (!user) {
        // user not found
        return {
          success: false,
          errors: [
            {
              path: "email",
              message: "Incorrect email or password."
            },
            {
              path: "password",
              message: "Incorrect email or password."
            }
          ]
        };
      }

      const valid = bcrypt.compareSync(password, user.password);

      if (!valid) {
        // email not valid
        return {
          success: false,
          errors: [
            {
              path: "email",
              message: "Incorrect email or password."
            },
            {
              path: "password",
              message: "Incorrect email or password."
            }
          ]
        };
      }

      // login sucessful
      req.session.userId = user.id;
      console.log("req.session: ", req.session);
      console.log("req.sessionID: ", req.sessionID);
      if (req.sessionID) {
        console.log("userSids: ", `userSids:${subdomain}-${user.id}`);
        const redis =
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "test_ci"
            ? new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)
            : new Redis();
        await redis.lpush(`userSids:${subdomain}-${user.id}`, req.sessionID);
      }

      // user found
      return {
        success: true,
        sessionID: req.sessionID,
        subdomain,
        user
      };
    },

    logoutUser: async (_, __, { req, res, subdomain }) => {
      const redis =
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "test_ci"
          ? new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)
          : new Redis();

      const { userId } = req.session;

      if (userId) {
        const sessionIds = await redis.lrange(
          `userSids:${subdomain}-${userId}`,
          0,
          -1
        );
        console.log("sessionIds: ", sessionIds);
        const promises = [];

        for (let i = 0; i < sessionIds.length; i += 1) {
          promises.push(redis.del(`sess:${sessionIds[i]}`));
        }

        await Promise.all(promises);

        req.session.destroy(err => {
          if (err) {
            console.log(err);
          }
        });

        console.log(
          `User ID: ${userId} from Account: ${subdomain} has logged out`
        );

        // Clear cookie
        res.clearCookie("qid");

        return true;
      }

      return false;
    },

    registerUser: async (_, args, { models }) => {
      const { firstName, lastName, email, password } = args;
      const { subdomain, industry } = args;

      try {
        const account = await models.Account.findOne(
          { where: { subdomain } },
          { raw: true }
        );

        if (account) {
          return {
            success: false,
            errors: [
              {
                path: "subdomain",
                message: "Subdomain is already taken"
              }
            ]
          };
        } else {
          const response = await models.sequelize.transaction(
            async transaction => {
              // Create a schema
              await models.sequelize.createSchema(subdomain);

              // Migrate users model
              await models.User.sync({
                schema: subdomain,
                searchPath: subdomain
              });

              // Count users
              const count = await models.User.count({
                searchPath: subdomain,
                transaction
              });

              const user = await models.User.create(
                { firstName, lastName, email, password, isAdmin: !count },
                { searchPath: subdomain, transaction }
              );

              const account = await models.Account.create(
                { subdomain, industry, owner: user.dataValues.id },
                { transaction }
              );

              // Sync the reset schemas asynchronously
              // map(Object.keys(models), (key) => {
              //     if (['sequelize', 'Sequelize', 'Account', 'User'].includes(key)) return
              //     models[key].sync({schema: subdomain, searchPath: subdomain})
              //   })

              const asyncCreateTableFunc = async () => {
                await models.Customer.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Project.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Sale.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Task.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Item.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Invoice.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Invitation.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Event.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Channel.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.ChannelMessage.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.DirectMessage.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
                await models.Member.sync({
                  schema: subdomain,
                  searchPath: subdomain
                });
              };

              asyncCreateTableFunc();

              return { user, account };
            }
          );

          // Create emailToken if not on test env
          process.env.NODE_ENV !== "test" ||
            (process.env.NODE_ENV !== "test_ci" &&
              jwt.sign(
                {
                  id: response.user.dataValues.id,
                  email: response.user.dataValues.email
                },
                process.env.JWTSECRET1,
                { expiresIn: "60d" },
                (err, emailToken) => {
                  if (err) {
                    console.log("err token: ", err);
                  }

                  const url = `${process.env.CLIENT_PROTOCOL}${
                    response.account.subdomain
                  }.${
                    process.env.CLIENT_HOST
                  }/login/confirmation/?token=${emailToken}`;

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

                  email
                    .send({
                      template: "email_confirmation",
                      message: {
                        to: response.user.dataValues.email,
                        subject: "Confirm your Email (Toolsio)"
                      },
                      locals: {
                        firstName: response.user.dataValues.firstName,
                        confirmationLink: url
                      }
                    })
                    .then(res =>
                      console.log("Email confirmation success: ", {
                        message: res.message,
                        from: res.originalMessage.from,
                        to: res.originalMessage.to,
                        subject: res.originalMessage.subject,
                        text: res.originalMessage.text
                      })
                    )
                    .catch(err =>
                      console.error("Email confirmation error: ", err)
                    );

                  /*
                const msg = {
                  to: 'birhanuh@gmail.com',
                  from: 'test@example.com',
                  subject: 'Sending with SendGrid is Fun',
                  text: 'and easy to do anywhere, even with Node.js',
                  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                };
                sgMail.send(msg);
                */
                }
              ));

          return {
            success: true,
            account: response.account
          };
        }
      } catch (err) {
        console.log("err: ", err);

        // Drop a schema
        models.sequelize.dropSchema(subdomain);

        return {
          success: false,
          errors: formatErrors(err)
        };
      }
    },

    isSubdomainExist: (_, { subdomain }, { models }) =>
      models.Account.findOne({ where: { subdomain } }, { raw: true })
        .then(account => {
          if (account) {
            return {
              success: true,
              subdomain: account.dataValues.subdomain
            };
          } else {
            return {
              success: false,
              errors: [
                {
                  path: "subdomain",
                  message:
                    "There is no account with such subdomain! Go to Sign up page to sign for free!"
                }
              ]
            };
          }
        })
        .catch(err => {
          console.log("err: ", err);
          return {
            success: false,
            errors: formatErrors(err)
          };
        }),

    registerInvitedUser: async (
      _,
      { firstName, lastName, email, password, token },
      { models }
    ) => {
      const { account } = jwt.verify(token, process.env.JWTSECRET1);

      try {
        const accountLocal = await models.Account.findOne(
          { where: { subdomain: account } },
          { raw: true }
        );

        if (accountLocal) {
          try {
            models.User.create(
              { firstName, lastName, email, password, isConfirmed: true },
              { searchPath: accountLocal.subdomain }
            ).catch(err => {
              console.log("Invited user registration: ", err);
            });

            // Set isInvitaitonAccepted to true
            models.Invitation.update(
              { isInvitationAccepted: true },
              {
                where: { email },
                returning: true,
                plain: true,
                searchPath: accountLocal.subdomain
              }
            )
              .then(() => console.log("Invitation update success"))
              .catch(err => {
                console.log("Invitation create err: ", err);
                return {
                  success: false,
                  errors: formatErrors(err)
                };
              });

            return {
              success: true,
              account: accountLocal
            };
          } catch (err) {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err)
            };
          }
        } else {
          return {
            success: false,
            errors: [
              {
                path: "subdomain",
                message: `Account *${account}* to which you are invited doesn't exist. You can create it as your own new account by going to sign up page`
              }
            ]
          };
        }
      } catch (err) {
        console.log("err: ", err);
        return {
          success: false,
          errors: formatErrors(err)
        };
      }
    },

    forgotPasswordResetRequest: async (_, { email }, { models, subdomain }) => {
      try {
        const account = await models.Account.findOne(
          { where: { subdomain } },
          { raw: true }
        );

        if (!account) {
          return {
            success: false,
            errors: [
              {
                path: "subdomain",
                message: `Account ${subdomain} doesn't exist`
              }
            ]
          };
        } else {
          const user = await models.User.findOne({
            where: { email },
            searchPath: subdomain
          });

          if (user) {
            // Create forgotPasswordResetRequestToken
            process.env.NODE_ENV !== "test" ||
              (process.env.NODE_ENV !== "test_ci" &&
                jwt.sign(
                  {
                    id: user.dataValues.id,
                    email: user.dataValues.email,
                    subdomain: account.dataValues.subdomain
                  },
                  process.env.JWTSECRET1,
                  { expiresIn: "60d" },
                  (err, forgotPasswordResetRequestToken) => {
                    if (err) {
                      console.log("err token: ", err);
                    }

                    const url = `${process.env.CLIENT_PROTOCOL}${
                      account.subdomain
                    }.${
                      process.env.CLIENT_HOST
                    }/login/password-reset/?token=${forgotPasswordResetRequestToken}`;

                    const email = new Email({
                      message: {
                        from: "no-replay@toolsio.com"
                      },
                      // uncomment below to send emails in development/test env:
                      send: true,
                      // transport: {
                      //   jsonTransport: true
                      // }
                      transport: transporter
                    });

                    email
                      .send({
                        template: "reset_password",
                        message: {
                          to: user.dataValues.email,
                          subject: "Password reset (Toolsio)"
                        },
                        locals: {
                          firstName: user.dataValues.firstName,
                          passwordResetLink: url
                        }
                      })
                      .then(res =>
                        console.log("Password confirmation success: ", res)
                      )
                      .catch(err =>
                        console.error("Password confirmation error: ", err)
                      );
                  }
                ));

            return {
              success: true
            };
          } else {
            return {
              success: false,
              errors: [
                {
                  path: "subdomain",
                  message: `You don't have credentials on (${subdomain}) account`
                }
              ]
            };
          }
        }
      } catch (err) {
        console.log("err: ", err);

        return {
          success: false,
          errors: formatErrors(err)
        };
      }
    },

    passwordReset: async (_, { password, token }, { models }) => {
      try {
        const { email, subdomain } = jwt.verify(token, process.env.JWTSECRET1);

        const account = await models.Account.findOne(
          { where: { subdomain: subdomain } },
          { raw: true }
        );

        if (!account) {
          return {
            success: false,
            errors: [
              {
                path: "subdomain",
                message: `Account ${subdomain} doesn't exist`
              }
            ]
          };
        } else {
          return models.User.update(
            { password },
            {
              where: { email: email },
              returning: true,
              plain: true,
              searchPath: account.subdomain
            }
          )
            .then(() => {
              return {
                success: true
              };
            })
            .catch(err => {
              console.log("err: ", err);
              return {
                success: false,
                errors: formatErrors(err)
              };
            });
        }
      } catch (err) {
        console.log("err: ", err);

        return {
          success: false,
          errors: formatErrors(err)
        };
      }
    },

    confirmUserEmail: async (_, { token }, { models, subdomain }) => {
      try {
        const { email } = jwt.verify(token, process.env.JWTSECRET1);

        const user = await models.User.findOne(
          { where: { email }, searchPath: subdomain },
          { raw: true }
        );

        if (user.isConfirmed) {
          return {
            success: false,
            errors: [
              {
                path: "message",
                message: `Your email is already confirmed`
              }
            ]
          };
        } else {
          return models.User.update(
            { isConfirmed: true },
            {
              where: { email: email },
              returning: true,
              plain: true,
              searchPath: subdomain
            }
          )
            .then(() => {
              return {
                success: true
              };
            })
            .catch(err => {
              console.log("err: ", err);
              return {
                success: false,
                errors: formatErrors(err)
              };
            });
        }
      } catch (err) {
        console.log("err: ", err);
        return {
          success: false,
          errors: formatErrors(err)
        };
      }
    }
  }
};

/*
export const loginUserPassportJs = async (req, email, password, models, subdomain) => {
  passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    
    console.log('reqz: ', req)
    return {
      success: true,    
      authToken: 'adf',
      refreshAuthToken: 'sdf'
    } 
  }
}
*/
// Login User
// router.post('/login', passport.authenticate('local'), function(req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   if (req.user.get('is_confirmed')) {
//     res.json({ id: req.user.id, first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email,
//       admin: req.user.admin })

//   } else {
//     res.status(500).json({
//       errors: {
//         confirmation: 'fail',
//         message: 'Please confirm your email to login'
//       }
//     })
//   }

// })

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {

//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       res.status(500).json({
//         errors: {
//           confirmation: 'fail',
//           message: {
//             errors: {
//               email: {
//                 message: 'Incorrect email.'
//               },
//               password: {
//                 message: 'Incorrect password.'
//               }
//             }
//           }
//         }
//       })
//       return
//     }

//     if (user) {
//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err)
//         }

//         if (user.get('is_confirmed')) {
//           res.json({ id: user.get('id'), first_name: user.get('first_name'), last_name: user.get('last_name'), email: user.get('email'),
//             admin: user.get('admin'), account: user.get('account') })
//         } else {
//           res.status(500).json({
//             errors: {
//               confirmation: 'fail',
//               message: 'Please confirm your email to login'
//             }
//           })
//         }
//       })
//       return
//     }
//   })(req, res, next)
// })

// router.post('/logout', function(req, res) {
//   req.logout()
//   req.session.destroy(function(err) {
//     if (err) {
//       res.status(500).json({
//         errors: {
//           confirmation: 'fail',
//           message: err
//         }
//       })
//       return
//     }
//     res.json({ success: true })
//   })
// })
/**
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  models.User.findById(id, { searchPath: subdomain })
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err, null)
    })
})

passport.use(new LocalStrategy({usernameField: 'email'},
  async function(email, password, done) {
    onsole.log('reqz: ', user)
    const user = await models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })

    console.log('reqz: ', user)
    if (!user) {
      // user not found
      return done(null, false)
    }

    const valid = bcrypt.compareSync(password, user.password)

    if (!valid) {
      // email not found
      return done(null, false)
    } else {
      return done(null, user)
    }

    // models.User.findOne({ where: {email: email}, raw: true })
    //   .then(user => {
    //     if (user) {
    //       models.User.comparePassword(password, user.get('password'), function(err, isMatch) {
    //         if (err) { return done(err); }
            
    //         if(isMatch){
    //           return done(null, user)
    //         } else {
    //           return done(null, false)
    //         }
    //       })
    //     } else {
    //       return done(null, false)
    //     }
    //   })
    //   .catch(err => { throw err })
  }
))

*/
