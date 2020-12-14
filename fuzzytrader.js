const assetsModule = require('./assets')
const dbModule = require('./db')

// Determines if will be offered lower risk (conservative) or high stakes (agressive) assets to the trader.
// The rationale is to allow up to 20% of total amount invested in high stakes assets.
// For example, if the portfolio is 80k conservative + 10k agressive, we allow more 10k on agressive assets.
// So, if the next trade amount is, lets say, 11k, we will only allow conservative assets.
function getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, callback) {
	if (tradeAmount <= 0) return []
	
	let typeSelected = 'agressive'
	if (((agressiveAmount + tradeAmount) / (portfolioAmount + tradeAmount)) > 0.2)
		typeSelected = 'conservative'

	dbModule.searchAssets(typeSelected, callback(assets))
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
	dbModule.listPortfolio((portfolio) => {
		let existingItem = getAssetInList(portfolio, item.symbol)
		
		if (existingItem) {
			existingItem.quantity += item.quantity
			dbModule.alterPortfolio(existingItem, callback)
		} else {
			dbModule.addToPortfolio(item, callback)
		}
	})
}

// Used when the quantity is known (portfolio) to get price and total amount of the asset and set them.
// Sets asset price, amount and total amount of portfolio after its recalculation.
// Calls the assets module and waits till it respond to call callback.
// The last parameter is to allow automated test to fix prices. I used Jest mocked functions, but
// the function I mocked behaves the way I implemented only if called directly, not through other functions.
// I mean that I thought it would be enough mocking getPrice() and expecting it to work differently when called by
// 'setPriceAndAmount()'. But, that didn't happened. My calls to setPriceAndAmount() were ignoring the mocked getPrice().
function setPriceAndAmount(portfolio, asset, callback, mockedGetPrice) {
	let setData = function (price) {
		asset.price = Number(price)
		asset.amount = Number(asset.quantity * price)
		
		let total = 0
		portfolio.assets.forEach((item) => { total += item.amount })
		portfolio.total_amount = total
		callback(asset.price, asset.amount)
	}
	if (mockedGetPrice) mockedGetPrice(asset, setData)
	else getPrice(asset, setData)
}

function getPrice(asset, callback) {
	if (asset.type == 'stock')
		assetsModule.getStockPrice(asset.symbol, callback)
	else if (asset.type == 'crypto')
		assetsModule.getCryptoPrice(asset.symbol, callback)
}
	
// Utility functions

function getAssetInPortfolio(portfolio, symbol) {
	return getAssetInList(portfolio.assets, symbol)
}

function getAssetInList(list, symbol) {
	let asset = null
	list.forEach((item) => {
		if (item.symbol == symbol) asset = item
	})
	return asset
}

function f1() {
	return f2()
}
function f2() {
	console.log(1)
	return 1
}

module.exports = { getOrdersForAmount, getPortfolio, addToPortfolio, setPriceAndAmount, f1, f2 }
