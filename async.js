
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

const  is_open = async() => {
  let pp = await axios.get(host+'/position')
  if(pp.data[0].status === "open"){
    return true;
  }else{
    return false;
  }
}

const logs = async(log_type, comment) => {
  let insert_date = moment().format("DD/MM/YYYY HH:mm");
  let pp = await axios.post(host+'/logs', {log_type: log_type, insert_date: insert_date, comment: comment})
}


const order = async(type, quantity) =>{
  //обращение к бинансу
  try {
    let kkk = await binance.order({symbol: 'PAXUSDT', side: type, quantity: quantity,  type: 'market'})
    let price = kkk.fills[0].price;
    console.log(price);
    //запись лога
    await logs(type, "{'type': '"+type+"', 'quantity': "+quantity+", 'price': "+price+"}")
  } catch (err) {
    console.log(err)
    await logs("error", err)
  }
}




;(async () => {
  const ohlcv = await binance.candles({ symbol: 'PAXUSDT', limit: 1, interval: '1m' })
  let curr_price = await parseFloat(ohlcv[0].high);
  curr_price = 1.01
  //console.log(ohlcv)
  //console.log(curr_price)
  //let pp1 = await axios.post(host+'/position', {quantity: 15})

  let pp2 = await axios.get(host+'/position')

  let lowest_price = parseFloat(pp2.data[0].lowest_price);
  let highest_price = parseFloat(pp2.data[0].highest_price);
  let quantity = parseFloat(pp2.data[0].quantity);
  let status = pp2.data[0].status;

  console.log('curr_status: '+status);
  console.log('curr_price: '+curr_price);
  console.log('lowest_price: '+lowest_price);
  console.log('highest_price: '+highest_price);
  console.log('quantity: '+quantity);



  if(status === "open"){
    //  Продавай
    console.log('status: in sell')
    let reason = await pr.line_calc(curr_price,'high');
    if(reason === 'high_sell'){
      console.log('exit: Продаю')
      await order('sell', quantity)
      // Меняю статус позиции
      let pp = await axios.post(host+'/position', {status: 'close'})
      //Лог продажи
    }else{
      console.log("Продолжаю ждать")
    }
  }else{
    ///Покупаю
    console.log('status: in buy')
    let reason = await pr.line_calc(curr_price,'low');
    console.log('reason: '+reason);
    if(reason === 'low_buy'){
      console.log('exit: Покупаю')
      await order('buy', quantity)
      // Меняю статус позиции
      let pp = await axios.post(host+'/position', {status: 'open'})
    }else{
      console.log('exit: no buy')
    }
  }
}) ()
