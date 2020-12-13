// unit tests of the fuzzytrader app - business rules.

// this is the module to be tested, some functions will be mocked
const fuzzy = require('../fuzzytrader')

// for simulations
const db = require('../db')

// avoid timeout with the web database (default 5s)
jest.setTimeout(30000)

// this is the first thing done by Jest, it is executed only once before all tests.
beforeAll(done => {	
	// avoid running tests on not test databases.
	//expect(db.dbUrl).toMatch('test')
	
	db.clearPortfolio((response) => {
		done()
	})
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
		db.addToPortfolio({symbol:'AAPL', quantity:300}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')
				expect(portfolio.total_amount).toBe(0)
				expect(aaplItem.symbol).toBe('AAPL')
				expect(aaplItem.quantity).toBe(300)
				expect(aaplItem.amount).toBe(0)
				
				fuzzy.setPriceAndAmount(portfolio, aaplItem, (price, amount) => {
					expect(aaplItem.amount).toBeGreaterThan(0)
					expect(aaplItem.price).toBeGreaterThan(0)
					expect(portfolio.total_amount).toBe(aaplItem.amount)
					
					done()
				})
			})
		})
	})
	test('two assets', done => {
		db.addToPortfolio({symbol:'XRP', quantity:90.9565857}, (item2) => {
			fuzzy.getPortfolio((portfolio) => {
				let xrpItem = getAssetInPortfolio(portfolio, 'XRP')

				fuzzy.setPriceAndAmount(portfolio, xrpItem, (price, amount) => {
					xrpItem = getAssetInPortfolio(portfolio, 'XRP')
					let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')
					
					expect(xrpItem.price).toBe(90.9565857)
					expect(xrpItem.amount).toBeGreaterThan(0)
					expect(xrpItem.price).toBeGreaterThan(0)

					expect(aaplItem.price).toBe(300)
					expect(aaplItem.amount).toBeGreaterThan(0)
					expect(aaplItem.price).toBeGreaterThan(0)

					expect(portfolio.total_amount).toBe(
						aaplItem.amount + xrpItem.amount)

					done()
				})
			})
		})
	})
	test('alter one', done => {
		db.addToPortfolio({symbol:'VALE', quantity:80000}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let valeItem = getAssetInPortfolio(portfolio, 'VALE')
				fuzzy.setPriceAndAmount(portfolio, valeItem, (price, amount) => {
					fuzzy.getPortfolio((portfolio2) => {
						valeItem = getAssetInPortfolio(portfolio2, 'VALE')
						let xrpItem = getAssetInPortfolio(portfolio2, 'XRP')

						expect(xrpItem.quantity).toBe(90.9565857)
						expect(xrpItem.amount).toBeGreaterThan(0)
						expect(xrpItem.price).toBeGreaterThan(0)

						expect(valeItem.price).toBe(80000)
						expect(valeItem.amount).toBeGreaterThan(0)
						expect(valeItem.price).toBeGreaterThan(0)

						expect(portfolio2.total_amount).toBe(
							btcItem.amount + valeItem.amount)

						done()
					})
				})
			})
		})
	})
})

describe('Orders', () => {
	test('empty', done => {
		let amount = 1000
		fuzzy.getOrdersForAmount(amount, (orders) => {
			expect(orders.length).toBe(3)
			
			expect(orders[0].symbol).toBe('AAPL')
			expect(orders[0].quantity).toBe(Math.trunc(amount / 135.66))
			expect(orders[0].price).toBe(135.66)
			
			expect(orders[1].symbol).toBe('BNB')
			expect(orders[1].quantity).toBe((amount / 183.05).toFixed(5))
			expect(orders[1].price).toBe(183.05)
			
			expect(orders[2].symbol).toBe('VALE')
			expect(orders[2].quantity).toBe(Math.trunc(amount / 55.0))
			expect(orders[2].price).toBe(55.0)
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
