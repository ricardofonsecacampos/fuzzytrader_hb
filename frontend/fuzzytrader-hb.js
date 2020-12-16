const baseUrl = 'https://fuzzytrader-app.herokuapp.com/'

// Requests the suggested orders based on the portfolio state and trade amount.
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

// Requests the updated portfolio with prices and amounts.
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

// Requests to add one asset in the portfolio or increment its quantity.
function addToPortfolio(asset, callback) {
	fetch((baseUrl + 'portfolio/add'), {
		method: "POST",
		body: JSON.stringify({symbol: asset.symbol, quantity: asset.quantity})
	})
		.then(callback)
		.catch(() => {
			//TODO add error message.
		})
}
