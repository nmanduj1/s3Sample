// Import libs necessary for generating pdf.
const AWS = require('aws-sdk')
const fs = require('fs')
const PDFDocument = require('pdfkit')
const request = require('request')
const http = require('http')

// Setup default file types that are accepted.
const validFileTypes = ["image/jpeg", "image/png", "image/jpg"]

/* generatePDF function accepts first name (:string), last name (:string),
 title (:string), array of requested urls (:arr of strings) and returns path to file */
const generatePDF = async (options) => {
  let { firstName, lastName, title, urlArray } = options

  // Initialize empty PDFKit document
  const doc = new PDFDocument({ layout : 'landscape' })

  // Initialize stream to save pdf file
  let filename = 'my-certificate.pdf'
  let writeStream = fs.createWriteStream(filename)

  // pipe writestream to created pdf doc, and set up general options
  doc.pipe(writeStream)
  doc.font('Helvetica')
   .fontSize(25)

  // call helper method to retrieve certificate template
  let retrievedTemplate = await retrieveTemplate()

  // add retrieved certificate template to initialized pdfkit doc
  doc.image(retrievedTemplate.Body, 0, 0, {width: 795, height: 614})

  // Set up styling for PDFKit certificate and add relevant text to appropriate fields
  doc.moveDown(9)
  doc.text(firstName + ' ' + lastName, {
    width: 610,
    align: 'center'
  })
  doc.moveDown(1)
  doc.text(title, {
    width: 510,
    align: 'center',
  })

  // call helper method to add images that were passed as params
  await addImages(doc, urlArray)

  // Finalizes new pdf and ends the stream
  doc.end()

  // returns path to file
  return filename
}

// exports function
module.exports = generatePDF

// Helper Methods

// retrieves certificate template from s3 bucket- returns promise that resolves to cert data
const retrieveTemplate = () => {
  // initialize S3 client with provided credentials.
  const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  // dictate params for the empty certificate template to be downloaded from S3- including bucket name and file name
  let params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: 'certificateTemplate.jpeg'
  }

  // create and return promise to handle retrieval of certificate template from S3 bucket
  // TODO: Add error handling if s3 fails on retrieval
  return new AWS.S3().getObject(params).promise()
}

// accepts a url, and returns a promise that resolves to the image buffer (if it exists)
const downloadImage = (url) => {
  return new Promise ((resolve, reject) => {
    request({ url, encoding: null }, (error, response, body) => {
      // checks for error, statusCode, and valid filetypes before creating buffer and resolving
      if ( error || response.statusCode !== 200 || (!validFileTypes.includes(response.headers['content-type'])) ) {
        reject(error, "err")
      }
      else {
        let img = Buffer.from(body, 'base64')
        resolve(img)
      }
    })
  })
}

// accepts the pdfkit doc, and the array of requested urls, adds images to the doc and returns void
const addImages = async (doc, urlArray) => {
  /* TODO: Modify this to be a forEach and instead of waiting for each individual promise to resolve,
  create an array of promises to be awaited. Would improve download speed! */
  for (let i = 0; i < urlArray.length; i++) {
    // set up try catch to handle errors when attempting to download image
    try {
      // await download image promise for the requested url
      let imageDownload = await downloadImage(urlArray[i])
      // if image is downloaded successfully, add new page and downloaded image to the newly created pdfKit doc
      if (imageDownload) {
        doc.addPage({
          margins: {
            top: 50,
            bottom: 50,
            left: 72,
            right: 72
          }
        })
        doc.image(imageDownload, {fit: [400, 400]})
      }
    }
    catch(err) {
      console.log(err, "err")
    }
  }
}
