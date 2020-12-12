// unit tests of the fuzzytrader app - database operations.

// this is the module to be tested
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

describe('Assets', () => {
	test('list all', done => {
		db.listAssets((assets) => {
			expect(assets.length).toBe(6)
			done()
		})
	})
	test('search conservative', done => {
		db.searchAssets('conservative', function (assets) {
			expect(assets.length).toBe(3)
			assets.forEach((asset) => {
				expect('AAPL,BNB,VALE').toMatch(asset.symbol)
				expect(asset.profile).toBe('conservative')
				done()
			})
		})
	})
	test('search agressive', done => {
		db.searchAssets('agressive', function (assets) {
			expect(assets.length).toBe(3)
			assets.forEach((asset) => {
				expect('XRP,BTCUSDT,KODK').toMatch(asset.symbol)
				expect(asset.profile).toBe('agressive')
				done()
			})
		})
	})
})

describe('Portfolio', () => {
	test('is empty', done => {
		db.listPortfolio((list) => {
			expect(list.length).toBe(0)
			done()
		})
	})
	test('adds an asset', done => {
		db.addToPortfolio({symbol:"AAPL", quantity:200}, function (item) {
			db.listPortfolio((list) => {
				expect(list.length).toBe(1)
				expect(list[0].symbol).toBe('AAPL')
				expect(list[0].quantity).toBe(200)
				done()
			})
		})
	})
	test('adds another asset', done => {
		db.addToPortfolio({symbol:"XRP", quantity:20.349834}, function (item) {
			db.listPortfolio((list) => {
				expect(list.length).toBe(2)
				expect(list[0].symbol).toBe('AAPL')
				expect(list[0].quantity).toBe(200)
				expect(list[1].symbol).toBe('XRP')
				expect(list[1].quantity).toBe(20.349834)
				done()
			})
		})
	})
	test('sets an asset quantity', done => {
		db.searchPortfolio('AAPL', function (list1) {
			db.alterPortfolio({"_id": list1[0]._id, "symbol": list1[0].symbol, "quantity": 500}, function () {
				db.searchPortfolio('AAPL', function (list2) {
					expect(list2[0].symbol).toBe('AAPL')
					expect(list2[0].quantity).toBe(500)
					db.searchPortfolio('XRP', function (list3) {
						expect(list3[0].symbol).toBe('XRP')
						expect(list3[0].quantity).toBe(20.349834)
						db.listPortfolio((list4) => {
							expect(list4.length).toBe(2)
							done()
						})
					})
				})
			})
		})
	})
})

