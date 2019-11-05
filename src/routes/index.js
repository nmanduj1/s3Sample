// import all routes and combine into master route to be exported
const combineRouters = require('koa-combine-routers')
const certificates = require('./certificates')

const masterRouter = combineRouters(
  certificates,
)

module.exports = masterRouter
