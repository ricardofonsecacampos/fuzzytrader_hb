function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	callback([
		{symbol:"AAPL", quantity:(amount/135.66).toFixed(), price:"135.66"},
		{symbol:"BNB", quantity:(amount/183.05).toFixed(5), price:"183.05"},
		{symbol:"VALE", quantity:(amount/55.0).toFixed(), price:"55.0"}
	])
}

function getPortfolio(callback) {
	callback({
		total_amount:"239,034.23",
		assets: [
			{symbol:"KODK", quantity:"9876.66", price:"135.66", amount:"567,855.0"},
			{symbol:"BTCUSDT", quantity:"7218.05", price:"183.05", amount:"23,423.20"},
			{symbol:"AAPL", quantity:"45000", price:"183.05", amount:"500,000.05"},
			{symbol:"XRP", quantity:"0.074657", price:"567855.0", amount:"855.0"}
		]
	})
}
