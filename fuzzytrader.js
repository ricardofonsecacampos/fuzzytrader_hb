const assetsModule = require('./assets')
const dbModule = require('./db')

// Determines if will be offered lower risk (conservative) or high stakes (agressive) assets to the trader.
// The rationale is to allow up to 20% of total amount invested in high stakes assets.
// For example, if the portfolio is 80k conservative + 10k agressive, we allow more 10k on agressive assets.
// So, if the next trade amount is, lets say, 11k, we will only allow conservative assets.
function getOrdersForAmount(tradeAmount, callback) {
	if (tradeAmount <= 0) return []
	
	getPortfolio((portfolio) => {
		let agressiveAmount = 0
		portfolio.assets.forEach((asset) => {
			if (asset.profile == 'agressive') agressiveAmount += asset.amount
		})
		let portfolioAmount = portfolio.total_amount	
	
		let typeSelected = 'agressive'
		if (((agressiveAmount + tradeAmount) / (portfolioAmount + tradeAmount)) > 0.2)
			typeSelected = 'conservative'

		dbModule.searchAssets(typeSelected, (assets) => {
			assets.forEach(asset => asset.amount = tradeAmount)
			fillAssetsPricesAndQuantities(assets, callback)
		})
	})
}

// Recursive function to set all prices and quantities of an assets lists.
// Used to set orders given an amount to trade.
function fillAssetsPricesAndQuantities(assets, callback) {
	let asset = nextAssetWithoutPrice(assets)
	if (!asset) {
		return callback(assets)
	}
	getPrice(asset, (price) => {
		asset.price = Number(price)
		asset.quantity = (
			(asset.type == 'stock') ? Math.trunc(asset.amount / price) : Number(asset.amount / price)
		)
		fillAssetsPricesAndQuantities(assets, callback)
	})
}

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

// Used by recursive functions to walk through unpriced assets.
function nextAssetWithoutPrice(assets) {
	let assetWP = null
	assets.forEach(asset => { if (!asset.price) assetWP = asset })
	return assetWP
}

// Insert or updates one asset in the portfolio.
// If the asset already exists, then increments its quantity.
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
module.exports = {
	getOrdersForAmount,
	getPortfolio, addToPortfolio,
	getAssetInPortfolio, getAssetInList
}
