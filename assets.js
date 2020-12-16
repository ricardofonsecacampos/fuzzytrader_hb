// Module for retrieving stock and cryptocurrency quotes on the internet.
// Using the Alpha Vantage API.
// The two functions must be mocked for automated tests.
// If the API blocks the request, we set 999.99 prices.

const apiKey = process.env.ASSETS_PRICE_API_KEY
const apiUrl = process.env.ASSETS_PRICE_API_URL

// NodeJS function for http requests.
const request = require("request");

// Retrieves stock quotation given its symbol.
// See 'www.alphavantage.co' for more information.
function getStockPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) {
			try {
				callback(body['Global Quote']['05. price'])
			} catch {
				// the API sometimes doesn't respond due to frequency limitation.
				callback(999.99)
			}
		}
	})
}

// Retrieves cryptocurrency value is US dollars.
// See 'www.alphavantage.co' for information about exchanges and more.
function getCryptoPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=CURRENCY_EXCHANGE_RATE&from_currency=' + symbol + '&to_currency=USD&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) {
			try {
				callback(body['Realtime Currency Exchange Rate']['5. Exchange Rate'])
			} catch {
				// the API sometimes doesn't respond due to frequency limitation.
				callback(999.99)
			}
		}
	})
}

module.exports = { getStockPrice, getCryptoPrice }
