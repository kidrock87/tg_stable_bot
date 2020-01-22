
const pr = require('./pc/price_channel');


const axios = require('axios');
const moment = require('moment');
const Binance = require('binance-api-node').default
const host = process.env.binance_host;
console.log(host)
console.log(process.env.binance_apiKey)
console.log(process.env.binance_apiSecret)
const binance = Binance({
  apiKey: process.env.binance_apiKey,
  apiSecret: process.env.binance_apiSecret,
  //getTime: xxx // time generator function, optional, defaults to () => Date.now()
})

console.log(host)





;(async () => {
  const aaa = await axios.post(host+'/position', {quantity: 20, highest_price :1.0005, lowest_price :0.9997, status: 'open'})
  console.log(aaa);
}) ()
