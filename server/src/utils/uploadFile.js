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

export const sendUploadToGCP = async (upload, destination) => {
  if (!upload) {
    return;
  }

  const { stream, filename, mimetype, encoding } = await upload;

  const bucketName = process.env.GCP_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcpFileName = `${Date.now()}-${filename}`;
  const file = bucket.file(destination + "/" + gcpFileName);

  const writeStream = file.createWriteStream({
    metadata: {
      contentType: mimetype
    }
  });

  const uploadPath = `https://storage.googleapis.com/${bucketName}/${destination}/${gcpFileName}`;

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
export const sendUploadToGCp = async (upload, destination) => {
  if (!upload) {
    return;
  }

  const { stream, filename, mimetype, encoding } = await upload;

  const bucketName = process.env.GCP_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcpFileName = `${Date.now()}-${filename}`;
  const file = bucket.file(gcpFileName);

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
    upload.cloudStorageObject = gcpFileName;
    return file.makePublic().then(() => {
      upload.gcpUrl = `https://storage.googleapis.com/${bucketName}/${destination}/${gcpFileName}`;
    });
  });

  writeStream.end(upload.buffer);

  return {
    path: `https://storage.googleapis.com/${bucketName}/${destination}/${gcpFileName}`,
    mimetype
  };
}; */
