const assetsModule = require('./assets')
const dbModule = require('./db')

function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	callback([
		{symbol:"AAPL", quantity:Math.trunc(amount/135.66), price:135.66,
		 	description:"Apple Inc. - Technology", type:"stock", profile:"conservative"},
		{symbol:"BNB", quantity:(amount/183.05).toFixed(5), price:183.05,
		 	description:"Binance Exchange cryptocurrency", type:"crypto", profile:"conservative"},
		{symbol:"VALE", quantity:Math.trunc(amount/55.0), price:55.0,
		 	description:"Vale S.A. - Iron ore, nickel", type:"stock", profile:"conservative"}
	])
}

// Lists available assets, sets price, sets the quantity owned by the trader (in his portfolio),
// calculateS each amount and then return it back through the callback function passed as a parameter.
function getPortfolio(callback) {
	dbModule.listAssets((assets) => {
		// mounts the portfolio JSON
		let jsonPortfolio = {total_amount: 0}
		jsonPortfolio.assets = assets
		
		// sets quantity.
		dbModule.listPortfolio((assetsPortfolio) => {
			assets.forEach((asset) => {
				// sets the 'quantity' property of each asset available.
				let assetPortfolio = assetsPortfolio[asset.symbol]
				if (assetPortfolio) {
					asset.quantity = assetPortfolio.quantity
					// sets price and amount
					getPrice(asset, (price) => {
						asset.price = price
						asset.amount = asset.quantity * price
						jsonPortfolio.total_amount += asset.amount
					})
					callback(json)
				} else {
					asset.quantity = 0
					asset.amount = 0
				}
			})
		})

		/*
		callback({
			total_amount:239034.23,
			assets: [
				{symbol:"KODK", quantity:9876, price:135.66, amount:567855.0, type:"stock", profile:"agressive"},
				{symbol:"BTCUSDT", quantity:18.05, price:183.05, amount:23423.20, type:"crypto", profile:"conservative"},
				{symbol:"AAPL", quantity:45000, price:183.05, amount:500000.05, type:"stock", profile:"conservative"},
				{symbol:"XRP", quantity:0.074657, price:567855.0, amount:855.0, type:"crypto", profile:"agressive"}
			]
		})
		*/
	})
}

function getPrice(asset, callback) {
	if (asset.type == 'stock')
	    assetsModule.getStockPrice(asset.symbol, callback)
	else
	    assetsModule.getCryptoPrice(asset.symbol, callback)
}
	
module.exports = { getOrdersForAmount, getPortfolio }
