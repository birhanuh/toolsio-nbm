import express from 'express'
import AWS from 'aws-sdk'

import Account from '../models/account'

let router = express.Router()

let env = process.env.NODE_ENV || 'development'

// Mongodb connection
import db from '../db'

// Get regisetred user
router.get('/:subdomain', async (req, res) => {

  // Connect to accounts db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
  }

  let account = await Account.find({ subdomain: req.params.subdomain })

  if (account.length !== 0 ) {    
    res.json( { result: account[0] }) 
  } else {
    res.json( { result: null }) 
  }

})

// Upload to S3
router.put('/:subdomain', async (req, res) => {

  let variables = req.body.variables

  const s3Bucket = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.S3_BUCKET,
    region: 'eu-central-1'
  })

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: variables.filename,
    Expires: 60,
    ContentType: variables.filetype,
    ACL: 'public-read'
  }

  const signedRequest = await s3Bucket.getSignedUrl('putObject', s3Params)
  const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${variables.filename}`

  // Connect to accounts db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
  }
 
  Account.findOne({ subdomain: req.params.subdomain }).exec((err, account) => {
    if (err) {
      console(err)
      return
    } 

    // Update field logo
    account.logo = url
    account.save()
      .then(account => {
        console.log('logo field updated', account)
      })
      .catch(err => 
        console.log('new account err', err)
      )
  })

  res.json( { result: {signedRequest: signedRequest, url: url} }) 
})

module.exports = router

