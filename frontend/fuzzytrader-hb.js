const baseUrl = 'https://fuzzytrader-app.herokuapp.com/'

function getOrdersForAmount(amount, callback) {
	if (!Number(amount) || amount <= 0) return []
	
	fetch((baseUrl + 'orders'), {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({portAmount: 0, portAgresAmount: 0, tradeAmount: amount})
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

function addToPortfolio(callback) {
	fetch(baseUrl + 'portfolio/add')
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
