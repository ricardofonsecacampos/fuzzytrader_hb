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


function getPostJsonParams(request, callback) {
	if (request.method == 'POST') {
		let body = ''
		req.on('data', chunk => {body += chunk.toString()})
		req.on('end', () => callback(JSON.parse(body)))
	}
}

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
			
		case '':
		case '/':
			contentType = 'text/html'
			location += '/fuzzytrader-hb.html'
			break;
		  
		case '/orders':
		case '/portfolio/add':
		case '/portfolio/get':
		default:
			serveFile = false
			break;
	}

	// starts writing the response.
	res.writeHead(200, { 'content-type': contentType })
	
	// serve the requested file.
	if (serveFile) {
		console.log('file')
		fs.createReadStream(location).pipe(res)
	} else {
		switch (req.url) {
			case '/portfolio/get':
				fuzzy.getPortfolio((portfolio) => {
					console.log('get')
					res.end(JSON.stringify(portfolio))
				})
				break;
			case '/portfolio/add':
				fuzzy.addToPortfolio({symbol:'AAPL', quantity:100}, () => {
					console.log('add')
					res.end('')
				})
				break;
			case '/orders':
				getPostJsonParams(req, (param) => {
					console.log(param)
					fuzzy.getOrdersForAmount(param.trade_amount, (assets) => {
						console.log('orders')
						res.end(JSON.stringify(assets))
					})
				})
				break;
			default: 
					console.log('end()')
					res.end()
		}
	}
}).listen(PORT)

console.log('Node server running on port ' + PORT)
