const assetsModule = require('./assets')
const dbModule = require('./db')

// Determines if will be offered lower risk (conservative) or high stakes (agressive) assets to the trader.
// The rationale is to allow up to 20% of total amount invested in high stakes assets.
// For example, if the portfolio is 80k conservative + 10k agressive, we allow more 10k on agressive assets.
// So, if the next trade amount is, lets say, 11k, we will only allow conservative assets.
function getOrdersForAmount(amount, callback) {
	if (amount <= 0) return []
	
	getPortfolio((portfolio) => {
		totalPortfolio = portfolio.total_amount
		let totalAgressive = 0
		portfolio.assets.forEach((asset) => {
			if (asset.amount && asset.type == 'agressive') totalAgressive += asset.amount
		})
		
		let typeSelected = 'agressive'
		if (((totalAgressive + amount) / totalPortfolio) > 0.2)
			typeSelected = 'conservative'
		
		dbModule.searchAssets(typeSelected, (assets) => {
			
		})
	})
	
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

function addToPortfolio(item, callback) {
	console.log(10)
	dbModule.listPortfolio((portfolio) => {
		console.log(11)
		let existingItem = getAssetInPortfolio(portfolio, item.symbol)
		console.log(item)
		console.log(existingItem)
		if (existingItem) {
			console.log(12)
			existingItem.quantity += item.quantity
			dbModule.alterPortfolio(existingItem, callback)
		} else {
			dbModule.addToPortfolio(item, callback)
		}
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
	
// Utility function
function getAssetInPortfolio(portfolio, symbol) {
	let asset = null
	portfolio.assets.forEach((item) => {
		if (item.symbol == symbol) asset = item
	})
	return asset
}
	
module.exports = { getOrdersForAmount, getPortfolio, addToPortfolio, setPriceAndAmount }
