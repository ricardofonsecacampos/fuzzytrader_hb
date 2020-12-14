// module for retrieving stock and cryptocurrency quotes on the internet.
// using the Alpha Advantage API.
// the two functions must be mocked for automated tests.

const apiKey = process.env.ASSETS_PRICE_API_KEY
const apiUrl = process.env.ASSETS_PRICE_API_URL

const request = require("request");

// retrieves stock quotation given its symbol.
function getStockPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(body['Global Quote']['05. price'])
	})
}

// retrieves cryptocurrency value is US dollars.
// see 'www.alphavantage.co' for information about exchanges and more.
function getCryptoPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=CURRENCY_EXCHANGE_RATE&from_currency=' + symbol + '&to_currency=USD&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(body['Realtime Currency Exchange Rate']['5. Exchange Rate'])
	})
}

module.exports = { getStockPrice, getCryptoPrice }
