// unit tests of the fuzzytrader app - stock price and cryptocurrency price online check.

// this is the module to be tested.
// the functions are not mocked and real API calls and real data are being tested
// to ensure the structure of the returned JSON remains the same, the API key is OK
// and the remote API is up and running ready for the application.
const assets = require('../assets')

// avoid timeout with internet lags (default 5s)
jest.setTimeout(10000)

// this is the first thing done by Jest, it is executed only once before all tests.
beforeAll(done => {
  done()
})

describe('Cryto', () => {
  test('API call OK', done => {
    console.log(process.env.NODE_ENV)
    assets.getCryptoPrice('BNB', (price) => {
      expect(price).not.toBeNaN()
      // at the coding date, the price was 27.8, hope this will never fail!
      expect(Number(price)).toBeGreaterThan(0.0001)
      done()
    })
  })
})

describe('Stock', () => {
  test('API call OK', done => {
    assets.getStockPrice('AAPL', (price) => {
      expect(price).not.toBeNaN()
      // at the coding date, the price was 122.8, hope this will never fail!
      expect(Number(price)).toBeGreaterThan(1)
      done()
    })
  })
})

