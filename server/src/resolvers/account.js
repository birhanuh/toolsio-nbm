import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'
// AWS
import AWS from 'aws-sdk'

const s3Bucket = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET,
  region: 'eu-central-1'
})

export default {
  Query: {
    getAccount: (parent, { subdomain }, { models }) => models.Account.findOne({ where: { subdomain } }, { raw: true }),
    
    getAccounts: requiresAuth.createResolver((parent, args, { models }) => models.Account.findAll())
  },

  Mutation: {
    updateAccount: requiresAuth.createResolver((parent, args, { models }) =>
      models.Account.update(args, { where: {subdomain: args.subdomain}, returning: true, plain: true })
        .then(result => {
          console.log('retur: ', result)
          // Delete previous logoUrl from S3
          if (args.logoUrl !== result[1]._previousDataValues.logoUrl) {
            const s3Params = {
              Bucket: process.env.S3_BUCKET,
              Key: 'logos'+result[1].dataValues
            }

            s3Bucket.deleteObject(s3Params, (err, data) => {
              if (err) {
                console.log('err', err)
                return
              }
              console.log('Deleted from s3Bucket', data)
            })
          }

          return {
            success: true,
            account: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    deleteAccount: requiresAuth.createResolver((parent, args, { models }) => 
      models.Account.destroy({ where: {subdomain: args.subdomain}, force: true })
        .then(res => {          
          return {
            success: (res === 1)
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    s3SignLogo: requiresAuth.createResolver(async (parent, args) => {

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: args.fileName,
        Expires: 60,
        ContentType: args.fileType,
        ACL: 'public-read'
      }

      try {
        const signedRequest = await s3Bucket.getSignedUrl('putObject', s3Params)
        const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${args.fileName}`

        return {
          signedRequest, 
          url
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          error: { 
            path: 'signedRequest',
            message: err 
          }
        }
      }
    })    
  }    
}
