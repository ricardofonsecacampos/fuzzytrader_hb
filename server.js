  
// HTTP server to link the application HTML page to services in NodeJS functions.

const http = require('http')
const fs = require('fs')

// use the port Heroku indicates
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
	console.log(req.url)
  
	let location = 'frontend'
	let serveFile = true
	let contentType = 'application/json'
  
	switch (req.url) {      
		case '/styles.css':
			contentType = 'text/css'
			location += req.url
			break;
      
		case '/fuzzytrader-hb.js':
			contentType = 'text/javascript'
			location += req.url
			break;
		  
		case '/get-portfolio':
			serveFile = false
			break;

		case '':
		case '/':
		default:
			contentType = 'text/html'
			location += '/fuzzytrader-hb.html'
			break;
	}

	// starts writing the response.
	res.writeHead(200, { 'content-type': contentType })
	// serve the requested file.
	if (serveFile) fs.createReadStream(location).pipe(res)

}).listen(PORT)

console.log('Node server running on port ' + PORT)
