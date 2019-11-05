// Import necessary libs, and initialize Koa app
const Koa = require('koa')
const app = new Koa()
const router = require('./routes')

const port = process.env.PORT || 3001

// Set up routes and start listening on specified port.
app.use(router())
app.listen(port)
