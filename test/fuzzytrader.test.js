// unit tests of the fuzzytrader app - business rules.

// this is the module to be tested, some functions will be mocked
const fuzzy = require('../fuzzytrader')

// initialization operations
const db = require('../db')

// avoid timeout with the web database (default 5s)
jest.setTimeout(10000)

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
		console.log(process.env.NODE_ENV)
		fuzzy.getPortfolio((portfolio) => {
			expect(portfolio.assets.length).toBe(4)
			expect(portfolio.total_amount).toBe(239034.23)
			done()
		})
	})
})

describe('Orders', () => {
	test('empty', done => {
		fuzzy.getOrdersForAmount(1000, (orders) => {
			expect(orders.length).toBe(3)
			
			expect(orders[0].symbol).toBe('AAPL')
			expect(orders[0].quantity).toBe(1000 / 135.66)
			expect(orders[0].price).toBe(135.66)
			
			expect(orders[1].symbol).toBe('BNB')
			expect(orders[1].quantity).toBe(1000 / 183.05)
			expect(orders[1].price).toBe(183.05)
			
			expect(orders[2].symbol).toBe('VALE')
			expect(orders[2].quantity).toBe(1000 / 55.0)
			expect(orders[2].price).toBe(55.0)
			done()
		})
	})
})
