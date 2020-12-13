// unit tests of the fuzzytrader app - business rules.

// this is the module to be tested, some functions will be mocked
const fuzzy = require('../fuzzytrader')

// to clear the portfolio before tests.
const db = require('../db')

// avoid timeout with the web database (default 5000ms)
jest.setTimeout(90000)

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
		fuzzy.addToPortfolio({symbol:'AAPL', quantity:300}, (item) => {
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
		fuzzy.addToPortfolio({symbol:'XRP', quantity:90.9565857}, (item) => {
			fuzzy.getPortfolio((portfolio) => {
				let xrpItem = getAssetInPortfolio(portfolio, 'XRP')
				let aaplItem = getAssetInPortfolio(portfolio, 'AAPL')

				fuzzy.setPriceAndAmount(portfolio, xrpItem, (price, amount) => {
					fuzzy.setPriceAndAmount(portfolio, aaplItem, (price, amount) => {

						expect(xrpItem.quantity).toBe(90.9565857)
						expect(xrpItem.amount).toBeGreaterThan(0)
						expect(xrpItem.price).toBeGreaterThan(0)

						expect(aaplItem.quantity).toBe(300)
						expect(aaplItem.amount).toBeGreaterThan(0)
						expect(aaplItem.price).toBeGreaterThan(0)

						expect(portfolio.total_amount).toBe(
							aaplItem.amount + xrpItem.amount)

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
						expect(aaplItem.amount).toBeGreaterThan(0)
						expect(aaplItem.price).toBeGreaterThan(0)

						expect(xrpItem.quantity).toBe(90.9565857)
						expect(xrpItem.amount).toBeGreaterThan(0)
						expect(xrpItem.price).toBeGreaterThan(0)
						
						expect(portfolio.total_amount).toBe(aaplItem.amount + xrpItem.amount)

						done()
					})
				})
			})
		})
	})
})

describe('Mock', () => {
	test('without mock', () => {
		expect(fuzzy.f1()).toBe(1)
	})
	test('with mock', () => {
		const f2spy = jest.spyOn(fuzzy, 'f2')
		f2spy.mockImplementation(() => {console.log(2);return 2})
		expect(f2spy).toHaveBeenCalled()
		expect(fuzzy.f2()).toBe(2)
		expect(fuzzy.f1()).toBe(2)
	})
})

describe.skip('Orders', () => {
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
