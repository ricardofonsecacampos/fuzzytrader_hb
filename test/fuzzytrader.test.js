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
		fuzzy.getPortfolio((portfolio) => {
			expect(portfolio.assets.length).toBe(4)
			expect(portfolio.total_amount).toBe(239,034.23)
			done()
		})
	})
})
