const assets = require('assets')
const db = require('db')

function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	callback([
		{symbol:"AAPL", quantity:(amount/135.66).toFixed(), price:"135.66",
		 	description:"Apple Inc. - Technology", type:"stock", profile:"conservative"},
		{symbol:"BNB", quantity:(amount/183.05).toFixed(5), price:"183.05",
		 	description:"Binance Exchange cryptocurrency", type:"crypto", profile:"conservative"},
		{symbol:"VALE", quantity:(amount/55.0).toFixed(), price:"55.0",
		 	description:"Vale S.A. - Iron ore, nickel", type:"stock", profile:"conservative"}
	])
}

function getPortfolio(callback) {
	callback({
		total_amount:"239,034.23",
		assets: [
			{symbol:"KODK", quantity:"9876", price:"135.66", amount:"567,855.0"},
			{symbol:"BTCUSDT", quantity:"18.05", price:"183.05", amount:"23,423.20"},
			{symbol:"AAPL", quantity:"45000", price:"183.05", amount:"500,000.05"},
			{symbol:"XRP", quantity:"0.074657", price:"567855.0", amount:"855.0"}
		]
	})
}

module.exports = { getOrdersForAmount, getPortfolio }
