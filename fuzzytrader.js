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

	dbModule.searchAssets(typeSelected, callback)
}
/*
// Lists available assets and sets the quantity owned by the trader (in his portfolio).
// The price and amount of each asset must be set after calling this function. Here they are set to 0.
function getPortfolio(callback) {
	dbModule.listAssets((assets) => {		
		// sets quantity.
		dbModule.listPortfolio((assetsPortfolio) => {
			assets.forEach((asset) => {
				asset.quantity = 0
				asset.amount = 0
				asset.price = 0
				
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
	})
}
*/
// Lists available assets and sets the quantity owned by the trader (in his portfolio).
// The price and amount of each asset is set at the end.
// Pops available assets not present in the portfolio.
function getPortfolio(callback) {
	dbModule.listAssets((assets) => {		
		// sets quantity.
		dbModule.listPortfolio((assetsPortfolio) => {
			// creates the portfolio JSON
			let portfolio = {total_amount: 0}
			portfolio.assets = []
			
			assets.forEach((asset) => {
				let assetInPortfolio = getAssetInList(assetsPortfolio, asset.symbol)
				if (assetInPortfolio) {
					portfolio.assets.push(asset)
					
					asset.quantity = assetInPortfolio.quantity
					asset.amount = 0
					asset.price = 0
				}
			})
			fillPortfolioPricesAndAmounts(portfolio, callback)
		})
	})
}

// Recursive function to set all prices and amounts of the portfolio.
function fillPortfolioPricesAndAmounts(portfolio, callback) {
	let asset = nextAssetWithoutPrice(portfolio.assets)
	
	if (!asset) {
		let total = 0
		portfolio.assets.forEach((item) => { total += item.amount })
		portfolio.total_amount = total
		return callback(portfolio)
	}
	
	getPrice(asset, (price) => {
		asset.price = Number(price)
		asset.amount = Number(asset.quantity * price)
		fillPortfolioPricesAndAmounts(portfolio, callback)
	})
}

// Uses the assets module to retrieve the price of a stock or cryptocurrency.
function getPrice(asset, callback) {
	if (asset.type == 'stock')
		assetsModule.getStockPrice(asset.symbol, callback)
	else if (asset.type == 'crypto')
		assetsModule.getCryptoPrice(asset.symbol, callback)
}

function nextAssetWithoutPrice(assets) {
	assets.forEach(asset => { if (!asset.price) return asset })
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

/*
// Used when the amount is known (order) to get the price and calculate the quantity.
// Sets asset price and quantity.
function setPriceAndQuantity(amount, asset, callback) {
	let setData = function (price) {
		asset.price = Number(price)
		asset.quantity = Number(amount / price)
		
		callback(asset.price, asset.quantity)
	}
	getPrice(asset, setData)
}

// Used when the quantity is known (portfolio) to get the price and calculate the amount of the asset.
// Sets asset price, amount and total amount of portfolio after its recalculation.
function setPriceAndAmount(portfolio, asset, callback) {
	let setData = function (price) {
		asset.price = Number(price)
		asset.amount = Number(asset.quantity * price)
		
		let total = 0
		portfolio.assets.forEach((item) => { total += item.amount })
		portfolio.total_amount = total
		callback(portfolio)
	}
	getPrice(asset, setData)
}
*/
	
// Utility functions.
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

// Outside available functions.
module.exports = { getOrdersForAmount,
		  getPortfolio, addToPortfolio,
		  setPriceAndAmount,
		  getAssetInPortfolio, getAssetInList
		 }
