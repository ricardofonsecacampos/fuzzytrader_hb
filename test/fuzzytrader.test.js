// Unit tests of the fuzzytrader app - business rules.
// The database has 6 items in the available assets collection.

// This is the module to be tested.
const fuzzy = require('../fuzzytrader')

// To clear the portfolio before tests.
const db = require('../db')

// Avoid timeout (default 5000ms) with the web database and financial API, if not mocked.
jest.setTimeout(90000)

// Mocks the assets module to be certain about assets quotation and make assertive tests.
const assets = require('../assets')
jest.mock('../assets');

jest.spyOn(assets, 'getStockPrice').mockImplementation((symbol, callback) => getPriceMocked)
jest.spyOn(assets, 'getCryptoPrice').mockImplementation((symbol, callback) => getPriceMocked)

assets.getStockPrice = getPriceMocked
assets.getCryptoPrice = getPriceMocked

// Mocked implementation.
function getPriceMocked(symbol, callback) {
	let price = -1
	switch (symbol) {
		case 'AAPL': price = 120.41; break;
		case 'XRP': price = 0.50621; break;
		case 'VALE': price = 16.46; break;
		case 'BTC': price = 19481.61; break;
		case 'BNB': price = 30.02514623; break;
		case 'KODK': price = 9.69; break;
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
			expect(portfolio.assets.length).toBe(0)
			done()
		})
	})
	test('one asset', done => {
		fuzzy.addToPortfolio({symbol:'AAPL', quantity:300}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let aaplItem = fuzzy.getAssetInPortfolio(portfolio, 'AAPL')
				expect(portfolio.assets.length).toBe(1)
				expect(aaplItem.symbol).toBe('AAPL')
				expect(aaplItem.quantity).toBe(300)
				expect(aaplItem.price).toBe(120.41)
				expect(aaplItem.amount).toBe(36123)
				expect(portfolio.total_amount).toBe(36123)
				done()
			})
		})
	})
	test('two assets', done => {
		fuzzy.addToPortfolio({symbol:'XRP', quantity:90.9565857}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				expect(portfolio.assets.length).toBe(2)
				
				let xrpItem = fuzzy.getAssetInPortfolio(portfolio, 'XRP')
				let aaplItem = fuzzy.getAssetInPortfolio(portfolio, 'AAPL')

				expect(xrpItem.quantity).toBe(90.9565857)
				expect(xrpItem.price).toBe(0.50621)
				expect(Number(xrpItem.amount.toFixed(8))).toBe(46.04313325)

				expect(aaplItem.quantity).toBe(300)
				expect(aaplItem.amount).toBe(36123)
				expect(aaplItem.price).toBe(120.41)

				expect(portfolio.total_amount).toBe(aaplItem.amount + xrpItem.amount)
				done()
			})
		})
	})
	test('alter one', done => {
		fuzzy.addToPortfolio({symbol:'AAPL', quantity:80000}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				expect(portfolio.assets.length).toBe(2)
				
				let aaplItem = fuzzy.getAssetInPortfolio(portfolio, 'AAPL')
				expect(aaplItem.quantity).toBe(80300)
				expect(aaplItem.amount).toBe(9668923)
				expect(aaplItem.price).toBe(120.41)
				
				let xrpItem = fuzzy.getAssetInPortfolio(portfolio, 'XRP')
				expect(xrpItem.quantity).toBe(90.9565857)
				expect(xrpItem.price).toBe(0.50621)
				expect(Number(xrpItem.amount.toFixed(8))).toBe(46.04313325)

				expect(portfolio.total_amount).toBe(aaplItem.amount + xrpItem.amount)
				done()
			})
		})
	})
})

describe('Orders', () => {
	test('initial trade (conservative)', done => {
		let tradeAmount = 1000
		let portfolioAmount = 0
		let agressiveAmount = 0
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].profile).toBe('conservative')
			expect(assets[1].profile).toBe('conservative')
			expect(assets[2].profile).toBe('conservative')
			
			let aaplItem = fuzzy.getAssetInList(assets, 'AAPL')
			expect(aaplItem.amount).toBe(1000)
			expect(aaplItem.price).toBe(120.41)
			expect(aaplItem.quantity).toBe(8)
				
			let bnbItem = fuzzy.getAssetInList(assets, 'BNB')
			expect(bnbItem.amount).toBe(1000)
			expect(bnbItem.price).toBe(0.50621)
			expect(bnbItem.quantity.toFixed(8)).toBe(1975,46472808)
			
			let valeItem = fuzzy.getAssetInList(assets, 'VALE')
			expect(valeItem.amount).toBe(1000)
			expect(valeItem.price).toBe(16.46)
			expect(valeItem.quantity).toBe(60)
			
			done()
		})
	})
	test('conservative portfolio', done => {
		let tradeAmount = 2000
		let portfolioAmount = 18000
		let agressiveAmount = 2000
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].profile).toBe('agressive')
			expect(assets[1].profile).toBe('agressive')
			expect(assets[2].profile).toBe('agressive')
			
			let kodkItem = fuzzy.getAssetInList(assets, 'KODK')
			expect(kodkItem.amount).toBe(2000)
			expect(kodkItem.price).toBe(9.69)
			expect(kodkItem.quantity).toBe(206)
				
			let bnbItem = fuzzy.getAssetInList(assets, 'BNB')
			expect(bnbItem.amount).toBe(2000)
			expect(bnbItem.price).toBe(30.02514623)
			expect(bnbItem.quantity.toFixed(8)).toBe(66,61083296)
			
			let btcItem = fuzzy.getAssetInList(assets, 'BTC')
			expect(btcItem.amount).toBe(2000)
			expect(btcItem.price).toBe(19481.61)
			expect(btcItem.quantity.toFixed(8)).toBe(0,10266092)
			done()
		})
	})
	test.skip('agressive portfolio', done => {
		let tradeAmount = 1000
		let portfolioAmount = 8000
		let agressiveAmount = 1000
		fuzzy.getOrdersForAmount(portfolioAmount, agressiveAmount, tradeAmount, (assets) => {
			expect(assets.length).toBe(3)
			expect(assets[0].profile).toBe('conservative')
			expect(assets[1].profile).toBe('conservative')
			expect(assets[2].profile).toBe('conservative')
			done()
		})
	})
})

