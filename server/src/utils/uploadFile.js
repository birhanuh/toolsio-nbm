import shortid from "shortid";
import * as mkdirp from "mkdirp";
import { createWriteStream } from "fs";
var gcpStorage = require("@google-cloud/storage");

//const client = new gcpStorage.Storage();

const storage = new gcpStorage.Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEYFILE
});

const uploadDir = "uploads";

// Ensure uplaodDir exists
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

export const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { path } = await storeUpload({ stream, filename });
  return { path, mimetype };
};

export const sendUploadToGCS = async (upload, destination) => {
  if (!upload) {
    return;
  }

  const { stream, filename, mimetype, encoding } = await upload;

  const bucketName = process.env.GCP_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${filename}`;
  const file = bucket.file(destination + "/" + gcsFileName);

  const writeStream = file.createWriteStream({
    metadata: {
      contentType: mimetype
    }
  });

  const uploadPath = `https://storage.googleapis.com/${bucketName}/${destination}/${gcsFileName}`;

  const promisifiedStream = new Promise((resolve, reject) =>
    stream
      .pipe(writeStream)
      .on("finish", () => resolve({ uploadPath }))
      .on("error", reject)
  );

  const pathObj = await promisifiedStream;

  return {
    path: pathObj.uploadPath,
    mimetype
  };
};

/**
export const sendUploadToGCS = async (upload, destination) => {
  if (!upload) {
    return;
  }

  const { stream, filename, mimetype, encoding } = await upload;

  const bucketName = process.env.GCP_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${filename}`;
  const file = bucket.file(gcsFileName);

  const writeStream = file.createWriteStream({
    metadata: {
      contentType: mimetype
    }
  });

  writeStream.on("error", err => {
    upload.cloudStorageObject = err;
    throw err;
  });

  writeStream.on("finish", () => {
    upload.cloudStorageObject = gcsFileName;
    return file.makePublic().then(() => {
      upload.gcsUrl = `https://storage.googleapis.com/${bucketName}/${destination}/${gcsFileName}`;
    });
  });

  writeStream.end(upload.buffer);

  return {
    path: `https://storage.googleapis.com/${bucketName}/${destination}/${gcsFileName}`,
    mimetype
  };
}; */
