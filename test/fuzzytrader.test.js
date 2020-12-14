// unit tests of the fuzzytrader app - business rules.

// this is the module to be tested.
const fuzzy = require('../fuzzytrader')

// to clear the portfolio before tests.
const db = require('../db')

// avoid timeout (default 5000ms) with the web database and financial API.
jest.setTimeout(90000)

// mocks the assets module to be certain about assets quotation and assertive tests.
const assets = require('../assets')
jest.mock('../assets');

jest.spyOn(assets, 'getStockPrice').mockImplementation((symbol, callback) => getPriceMocked)
jest.spyOn(assets, 'getCryptoPrice').mockImplementation((symbol, callback) => getPriceMocked)

assets.getStockPrice = getPriceMocked
assets.getCryptoPrice = getPriceMocked

// mocked implementation
function getPriceMocked(symbol, callback) {
	let price = -1
	switch (symbol) {
		case 'AAPL': price = 120.41; break;
		case 'XRP': price = 0.50621; break;
	}
	callback(price)
}

// this is the first thing done by Jest, it is executed only once before all tests.
beforeAll(done => {	
	// avoid running tests on not test databases.
	//expect(db.dbUrl).toMatch('test')
	
	db.clearPortfolio(response => done())
})

describe('Portfolio', () => {
	test('empty', done => {
		fuzzy.getPortfolio((portfolio) => {
			expect(portfolio.total_amount).toBe(0)
			expect(portfolio.assets.length).toBe(6)
			done()
		})
	})
	test('one asset', done => {
		fuzzy.addToPortfolio({symbol:'AAPL', quantity:300}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')
				expect(portfolio.total_amount).toBe(0)
				expect(aaplItem.symbol).toBe('AAPL')
				expect(aaplItem.quantity).toBe(300)
				expect(aaplItem.amount).toBe(0)
				
				fuzzy.setPriceAndAmount(portfolio, aaplItem, (price, amount) => {
					expect(aaplItem.price).toBe(120.41)
					expect(aaplItem.amount).toBe(36123)
					expect(portfolio.total_amount).toBe(aaplItem.amount)
					
					done()
				})
			})
		})
	})
	test('two assets', done => {
		fuzzy.addToPortfolio({symbol:'XRP', quantity:90.9565857}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let xrpItem = getAssetInPortfolio(portfolio, 'XRP')
				let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')

				fuzzy.setPriceAndAmount(portfolio, xrpItem, (price, amount) => {
					fuzzy.setPriceAndAmount(portfolio, aaplItem, (price, amount) => {

						expect(xrpItem.quantity).toBe(90.9565857)
						expect(xrpItem.price).toBe(0.50621)
						expect(xrpItem.amount).toBe(46.043133247197)

						expect(aaplItem.quantity).toBe(300)
						expect(aaplItem.amount).toBe(36123)
						expect(aaplItem.price).toBe(120.41)

						expect(portfolio.total_amount).toBe(aaplItem.amount + xrpItem.amount)

						done()
					})
				})
			})
		})
	})
	test('alter one', done => {
		fuzzy.addToPortfolio({symbol:'AAPL', quantity:80000}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')
				expect(aaplItem.quantity).toBe(80300)
				
				let xrpItem = getAssetInPortfolio(portfolio, 'XRP')
					
				fuzzy.setPriceAndAmount(portfolio, aaplItem, (price, amount) => {
					fuzzy.setPriceAndAmount(portfolio, xrpItem, (price, amount) => {
						expect(aaplItem.amount).toBe(9668923)
						expect(aaplItem.price).toBe(120.41)

						expect(xrpItem.quantity).toBe(90.9565857)
						expect(xrpItem.price).toBe(0.50621)
						expect(xrpItem.amount).toBe(46.043133247197)
						
						expect(portfolio.total_amount).toBe(aaplItem.amount + xrpItem.amount)

						done()
					})
				})
			})
		})
	})
})

describe('Orders', () => {
	test('initial trade', done => {
		let tradeAmount = 1000
		let portfolioAmount = 0
		let agressiveAmount = 0
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].type).toBe('conservative')
			expect(assets[1].type).toBe('conservative')
			expect(assets[2].type).toBe('conservative')
			done()
		})
	})
	test('conservative portfolio', done => {
		let tradeAmount = 1000
		let portfolioAmount = 9000
		let agressiveAmount = 1000
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].type).toBe('agressive')
			expect(assets[1].type).toBe('agressive')
			expect(assets[2].type).toBe('agressive')
			done()
		})
	})
	test('agressive portfolio', done => {
		let tradeAmount = 1000
		let portfolioAmount = 8000
		let agressiveAmount = 1000
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].type).toBe('conservative')
			expect(assets[1].type).toBe('conservative')
			expect(assets[2].type).toBe('conservative')
			done()
		})
	})
})

// Utility function
function getAssetInPortfolio(portfolio, symbol) {
	let asset = null
	portfolio.assets.forEach((item) => {
		if (item.symbol == symbol) asset = item
	})
	return asset
}
