//last 2 ohlcv 5 minutes
//смотрим последний и предпоследний

//сортируем и выбираем топ
//Верхний из верхних цен
//нижний из нижних

const axios = require('axios');
const moment = require('moment');
const Binance = require('binance-api-node').default


const binance = Binance({
  apiKey: process.env.binance_apiKey,
  apiSecret: process.env.binance_apiSecret,
  //getTime: xxx // time generator function, optional, defaults to () => Date.now()
})


async function line_calc(curr_price, g_type) {
  let ohlcv = await binance.candles({ symbol: 'PAXUSDT', interval: '5m', limit: 2 })
  let high1 = ohlcv[0]['high']
  let high2 = ohlcv[1]['high']
  let low1 = ohlcv[0]['low']
  let low2 = ohlcv[1]['low']
  let y2, y1, result;
  if(g_type == "low"){
     y2 = low2
     y1 = low1
  }else{
     y2 = high2
     y1 = high1
  }
  let future_price = 2*y2 - y1;
  if(g_type == "low"){
    if(curr_price > future_price){
      result = 'low_buy';
    }else{
      result = 'continue';
    }
  }else if(g_type = "high"){
    if(curr_price >= future_price){
      result='continue';
    }else{
      result='high_sell';
    }

  }

  console.log(y1)
  console.log(y2)
  console.log(future_price)
  console.log(result)
  return result;
}

// doStuff is defined inside the module so we can call it wherever we want

// Export it to make it available outside
module.exports.line_calc = line_calc;
