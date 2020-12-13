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
		// sets quantity.
		dbModule.listPortfolio((assetsPortfolio) => {
			assets.forEach((asset) => {
				// sets the 'quantity' property of each asset available.
				let assetPortfolio = assetsPortfolio[asset.symbol]
				asset.quantity = assetPortfolio ? assetPortfolio.quantity : asset.quantity = 0
			})
			
			// creates the portfolio JSON
			let jsonPortfolio = {total_amount: 0}
			jsonPortfolio.assets = assets
			callback(jsonPortfolio)
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

// Used when the quantity is known (portfolio) to get price and total amount of the asset.
// Calls de assets module and waits till it respond to callback.
function setPriceAndAmount(asset, callback) {
	let set = function (price) {
		asset.price = price
		asset.amount = asset.quantity * price
		console.set('set: price ' + asset.price + ', amount ' + asset.amount)
		callback(asset.price, asset.amount)
	}
	getPrice(asset, set)
}

function getPrice(asset, callback) {
	if (asset.type == 'stock')
		assetsModule.getStockPrice(asset.symbol, callback)
	else if (asset.type == 'stock')
		assetsModule.getCryptoPrice(asset.symbol, callback)
}
	
module.exports = { getOrdersForAmount, getPortfolio, setPriceAndAmount }
