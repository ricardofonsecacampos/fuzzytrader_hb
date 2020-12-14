const baseUrl = 'https://fuzzytrader-app.herokuapp.com/'

function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	fetch((baseUrl + 'orders'),
		{
			method: "POST",
			body: {portAmount: 0, portAgresAmount: 0, tradeAmount: amount}
		})
		.then(function (response) {
			console.log(response)
			response.json()
			.then(function (assets) {
				console.log(assets)
				callback(assets)
			})
			.catch(() => {
				//TODO add error message.
			})
		})
		.catch(() => {
			//TODO add error message.
		})
	/*
	callback([
		{symbol:"AAPL", quantity:(amount/135.66).toFixed(), price:"135.66"},
		{symbol:"BNB", quantity:(amount/183.05).toFixed(5), price:"183.05"},
		{symbol:"VALE", quantity:(amount/55.0).toFixed(), price:"55.0"}
	])
	*/
}


function getPortfolio(callback) {
	fetch(baseUrl + 'portfolio/get')
		.then(function (response) {
			console.log('from JS: ' + response)
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
	/*
	callback({
		total_amount:"239,034.23",
		assets: [
			{symbol:"KODK", quantity:"9876.66", price:"135.66", amount:"567,855.0"},
			{symbol:"BTCUSDT", quantity:"7218.05", price:"183.05", amount:"23,423.20"},
			{symbol:"AAPL", quantity:"45000", price:"183.05", amount:"500,000.05"},
			{symbol:"XRP", quantity:"0.074657", price:"567855.0", amount:"855.0"}
		]
	})
	*/
}
