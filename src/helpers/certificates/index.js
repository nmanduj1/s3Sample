// import all helper methods relating to certificates and export
const generatePDF = require('./generatePDF')
const s3Upload = require('./s3Upload')

module.exports = {
  generatePDF,
  s3Upload
}
