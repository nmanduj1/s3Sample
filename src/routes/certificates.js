// Import libs/ modules required for routes
const Router = require('koa-router')
const { generatePDF, s3Upload } = require('../helpers/certificates')

// Initialize Router for certificate routes
const router = new Router({
  prefix: '/certificates'
})

// Define routes
router.get('/generate', async (ctx, next) => {
  // Generates pdf with supplied params and uploads to s3.  Returns the pdf url as the response body.
  let filename = await generatePDF(ctx.query.firstName, ctx.query.lastName, ctx.query.title, ctx.query.urlArray)
  let url = await s3Upload(filename)

  ctx.status = 200
  ctx.body = url
})

module.exports = router
