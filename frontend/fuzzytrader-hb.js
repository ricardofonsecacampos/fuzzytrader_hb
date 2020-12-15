const baseUrl = 'https://fuzzytrader-app.herokuapp.com/'

function getOrdersForAmount(amount, callback) {
	if (!Number(amount) || amount <= 0) return []
	
	fetch((baseUrl + 'orders'), {
		method: "POST",
		body: JSON.stringify({trade_amount: amount})
	})
		.then(function (response) {
			response.json()
			.then(function (assets) {
				callback(assets)
			})
			.catch(() => {
				//TODO add error message.
			})
		})
		.catch(() => {
			//TODO add error message.
		})
}

function getPortfolio(callback) {
	fetch(baseUrl + 'portfolio/get')
		.then(function (response) {
			response.json()
			.then(function (portfolio) {
				callback(portfolio)
			})
			.catch(() => {
				//TODO add error message.
			})
		})
		.catch(() => {
			//TODO add error message.
		})
}

function addToPortfolio(asset, callback) {
	fetch((baseUrl + 'portfolio/add'), {
		method: "POST",
		body: JSON.stringify({symbol: asset.symbol, quantity: asset.quantity})
	})
		.then(function (response) {
			response.json()
			.then(function () {
				callback()
			})
			.catch(() => {
				//TODO add error message.
			})
		})
		.catch(() => {
			//TODO add error message.
		})
}
