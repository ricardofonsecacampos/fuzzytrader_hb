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

// Lists available assets and sets the quantity owned by the trader (in his portfolio).
// The price and amount of each asset must be set after calling this function. Here they are set to 0.
function getPortfolio(callback) {
	dbModule.listAssets((assets) => {		
		// sets quantity.
		dbModule.listPortfolio((assetsPortfolio) => {
			assets.forEach((asset) => {
				asset.quantity = 0
				asset.amount = 0
				
				// tries to find the asset in the portfolio.
				assetsPortfolio.forEach((item) => {
					if (item.symbol == asset.symbol) asset.quantity = item.quantity
				}) 
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
// Also recalculates the portfolio amount.
// Calls the assets module and waits till it respond to call callback.
function setPriceAndAmount(portfolio, asset, callback) {
	let set = function (price) {
		asset.price = Number(price)
		asset.amount = Number(asset.quantity * price)
		
		let total = 0
		portfolio.assets.forEach((item) => { total += item.amount })
		portfolio.total_amount = total
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
