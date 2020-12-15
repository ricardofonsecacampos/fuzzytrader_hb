const baseUrl = 'https://fuzzytrader-app.herokuapp.com/'

function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	fetch((baseUrl + 'orders'),
		{
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
				//setPriceAndAmount(portfolio, callback)
			})
			.catch(() => {
				//TODO add error message.
			})
		})
		.catch(() => {
			//TODO add error message.
		})
}
/*
function setPriceAndAmount(portfolio, callback) {
	portfolio.assets.forEach((asset) => {
		if (asset.quantity) {
			fetch(baseUrl + 'portfolio/price', {
				method: "POST",
				body: {symbol: asset.symbol}
			})
			.then(function (response) {
				response.json()
				.then(callback(portfolio))
				.catch(() => {
					//TODO add error message.
				})
			})
			.catch(() => {
				//TODO add error message.
			})
		}
	})
}
*/
