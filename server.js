  
// HTTP server to link the application HTML page to services in NodeJS functions.

const http = require('http')
const fs = require('fs')

// use the port Heroku indicates
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  console.log(req.path)
  
  // serve the HTML application page
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('frontend/fuzzytrader-hb.html').pipe(res)
  
}).listen(PORT)

console.log('Node server running on port ' + PORT)
