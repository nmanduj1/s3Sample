// Import libs necessary for uploading pdf to S3 bucket.
const AWS = require('aws-sdk')
const fs = require('fs')
const uuidv4 = require('uuid/v4')

// s3Upload function accepts filename and returns the aws file url
const s3Upload = async (filename) => {
  let pdfData = []
  // create read stream from filename to create buffer for s3 upload
  const reading = fs.createReadStream(filename).on('data', (d) => pdfData.push(d))
  await streamEnd(reading)
  let concattedBuff = Buffer.concat(pdfData)

  // create object key for upload using random uuid
  const objectKey = `${uuidv4()}.pdf`

  // create object with params to handle s3 upload
  const objectParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    ACL: 'public-read',
    ContentType: 'application/pdf',
    ContentDisposition: `inline; filename=${objectKey}`,
    Key:objectKey,
    Body:concattedBuff
  }

  // Create upload promise and await
  // TODO: add error handling if S3 fails on upload
  var uploadPromise = await new AWS.S3().putObject(objectParams).promise()

  //remove temp file
  fs.unlinkSync(filename)

  // return link to file on s3
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${objectKey}`
}

module.exports = s3Upload

// Helper Methods:

// accepts stream, returns promise that resolves on stream close
const streamEnd = (stream) => {
  return new Promise((resolve, reject) => {
    stream.on('error', reject)
    stream.on('close', resolve)
  })
}
