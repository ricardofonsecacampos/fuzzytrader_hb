// HTTP server to link the application HTML page to services in NodeJS functions.

// Http server module.
const http = require('http')
// Serve static files.
const fs = require('fs')
// Parse request parameters.
const {parse} = require('querystring');

// Fuzzy trader services
const fuzzy = require('./fuzzytrader.js')

// use the port Heroku indicates
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
	console.log(req.url)
	
	if (req.method == 'POST') {
		let body = ''
		req.on('data', chunk => {
			body += chunk.toString()
		})
		req.on('end', () => {
			console.log(parse(body))
		})
	}
	
	let location = 'frontend'
	let serveFile = false
	let contentType = 'application/json'
  
	switch (req.url) {      
		case '/styles.css':
			contentType = 'text/css'
			location += req.url
			serveFile = true
			break;
      
		case '/fuzzytrader-hb.js':
			contentType = 'text/javascript'
			location += req.url
			serveFile = true
			break;
		  
		case '/orders':
		case '/portfolio/add':
			serveFile = false
			break;

		case '':
		case '/':
		default:
			contentType = 'text/html'
			location += '/fuzzytrader-hb.html'
			serveFile = true
			break;
	}

	// starts writing the response.
	res.writeHead(200, { 'content-type': contentType })
	
	// serve the requested file.
	if (serveFile)
		fs.createReadStream(location).pipe(res)
	else {
		switch (req.url) {
			case '/portfolio/get':
				fuzzy.getPortfolio((portfolio) => {
					res.end(JSON.stringify(portfolio))
				})
				break;
			case '/portfolio/add':
				fuzzy.addToPortfolio({symbol:'AAPL', quantity:100}, () => {
					res.end('')
				})
				break;
			case '/orders':
				fuzzy.getOrdersForAmount(0, 0, 1000, (assets) => {
					res.end(JSON.stringify(assets))
				})
				break;
		}
	}
}).listen(PORT)

console.log('Node server running on port ' + PORT)
