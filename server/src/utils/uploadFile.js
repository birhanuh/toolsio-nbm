import shortid from 'shortid'
import * as mkdirp from 'mkdirp' 
import { createWriteStream } from 'fs'

const uploadDir = 'uploads'

// Ensure uplaodDir exists
mkdirp.sync(uploadDir)

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate()
  const path = `${uploadDir}/${id}-${filename}`

  return new Promise((resolve, reject) => 
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve( { path } ))
      .on('error', reject)
    )
}

export const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload
  const { path } = await storeUpload({ stream, filename })
  return { path, mimetype }
}