// module for retrieving stock and cryptocurrency quotes on the internet.
// using the Alpha Advantage API.

const apiKey = process.env.ASSETS_PRICE_API_KEY
const apiUrl = process.env.ASSETS_PRICE_API_URL

const request = require("request");

function getStockPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=GLOBAL_QUOTE&symbol=' + symbol + '&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(Number(body['Global Quote']['05. price']))
	})
}

function getCryptoPrice(symbol, callback) {
	jsonRequest = {
		json: true,
		url: apiUrl + '?function=CURRENCY_EXCHANGE_RATE&from_currency=' + symbol + '&to_currency=USD&apikey=' + apiKey
	}
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(Number(body['Realtime Currency Exchange Rate']['5. Exchange Rate']))
	})
}

module.exports = { getStockPrice, getCryptoPrice }
