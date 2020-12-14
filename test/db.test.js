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
				let xrpItem = getAssetInList(list, 'XRP')
				let aaplItem = getAssetInList(list, 'AAPL')
				
				expect(list.length).toBe(2)
				expect(aaplItem.quantity).toBe(200)
				expect(xrpItem.quantity).toBe(20.349834)
				done()
			})
		})
	})
	test('sets an asset quantity', done => {
		db.listPortfolio(function (list) {
			let aaplItem = getAssetInList(list, 'AAPL')
			aaplItem.quantity = 500
			
			db.alterPortfolio(aaplItem, function () {
				db.listPortfolio(function (list2) {
					aaplItem = getAssetInList(list2, 'AAPL')
					let xrpItem = getAssetInList(list2, 'XRP')
					
					expect(aaplItem.symbol).toBe('AAPL')
					expect(aaplItem.quantity).toBe(500)
					expect(xrpItem.symbol).toBe('XRP')
					expect(xrpItem.quantity).toBe(20.349834)
					
					expect(list2.length).toBe(2)
					done()
				})
			})
		})
	})
})

function getAssetInList(list, symbol) {
	let asset = null
	list.forEach((item) => {
		if (item.symbol == symbol) asset = item
	})
	return asset
}
