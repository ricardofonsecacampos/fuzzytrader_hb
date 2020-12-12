const assets = require('./assets')
const db = require('./db')

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

function getPortfolio(callback) {
	db.listAssets((assets) => {
		// sets quantity.
		db.listPortfolio((assetsPortfolio) => {
			assets.forEach((asset) => {
				// sets the 'quantity' property of each asset available.
				if (assetsPortfolio[asset.symbol])
					asset.quantity = assetsPortfolio[asset.symbol].quantity
				else asset.quantity = 0
			})
		})
		
		// sets price.
		
		// sets amount.
		let total = 0
		assets.forEach((asset) => {
			let amount = asset.quantity * asset.price
			total += amount
		})
		
		// mounts the portfolio JSON
		json = {total_amount: total}
		json.assets = assets
		callback(json)
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

module.exports = { getOrdersForAmount, getPortfolio }
