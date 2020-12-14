// Back end code used to talk to the database.
// As we are using RestDB, a serverless web available service, our calls
// are made over HTTP methods GET (to fetch data), POST (to include data),
// PUT (to update data) and DELETE (to remove data).

// nodejs function for http requests
const request = require("request");

let dbUrl = process.env.DB_URL
let dbKey = process.env.DB_KEY

function createRequest(collection, httpMethod = "GET") {
	return {
		method: httpMethod,
		url: dbUrl + collection,
		headers: {
			'cache-control': 'no-cache',
			'x-apikey': dbKey,
			'content-type': 'application/json'
		},
		json: true
	}
}

function createPortfolioRequest(operation) {
	return createRequest('portfolio', operation)
}

function createAssetsRequest(operation) {
	return createRequest('assets', operation)
}

function listAssets(callback) {
	return searchAssets(null, callback)
}

//TODO change first parameter to JSON
function searchAssets(profile, callback) {
	let jsonRequest = createAssetsRequest()
	if (profile) jsonRequest.url += '?q={"profile":"' + profile + '"}'
	
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(body)
	})                    
}

// Deletes all elements of the collection portfolio.
function clearPortfolio(callback) {
	listPortfolio(function (list) {
		let ids = []
		list.forEach((item) => { ids.push(item._id) })
		
		let jsonRequest = createPortfolioRequest("DELETE")
		jsonRequest.url += '/*'
		jsonRequest.body = ids
		
		request(jsonRequest, function (error, response, body) {
			if (error) throw new Error(error)
			if (callback) callback(body)
		})       
	})
}

function listPortfolio(callback) {
	return searchPortfolio(null, callback)
}

function searchPortfolio(symbol, callback) {
	let jsonRequest = createPortfolioRequest()
	if (symbol) jsonRequest.url += '?q={"symbol":"' + symbol + '"}'
	
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(body)
	})                    
}

// Saves to the portfolio collection.
// Expected item JSON: {symbol:aaa, quantity:333}
function addToPortfolio(item, callback) {
	let jsonRequest = createPortfolioRequest("POST")
	jsonRequest.body = item
	
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback(body)
	})                    
}

/*
// Don't know why but updating with PUT method didn't work
function alterPortfolio(item, callback) {
	let jsonRequest = createPortfolioRequest("PUT")
	jsonRequest.url += '/' + item._id
	jsonRequest.body = {"quantity": item.quantity}
	console.log(jsonRequest)
	request(jsonRequest, function (error, response, body) {
		if (error) throw new Error(error)
		if (callback) callback()
	})                    
}
*/

function alterPortfolio(item, callback) {
	if (item._id) {
		let jsonRequest = createPortfolioRequest("DELETE")
		jsonRequest.url += '/' + item._id
		
		request(jsonRequest, function (error, response, body) {
			if (error) throw new Error(error)
			delete item._id
			addToPortfolio(item, callback)
		})
	} else {
		addToPortfolio(item, callback)
	}
}

module.exports = {
	listAssets, searchAssets,
	clearPortfolio, listPortfolio, searchPortfolio, addToPortfolio, alterPortfolio,
	dbUrl, dbKey
}
