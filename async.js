const axios = require('axios');
const moment = require('moment');
const Binance = require('binance-api-node').default
const host = process.env.binance_host;
console.log(host)

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
  const ohlcv = await binance.trades({ symbol: 'PAXUSDT', limit: 1 })
  let curr_price = parseFloat(ohlcv[0].price);
  //let pp1 = await axios.post(host+'/position', {quantity: 15})

  let pp2 = await axios.get(host+'/position')
  let lowest_price = parseFloat(pp2.data[0].lowest_price);
  let highest_price = parseFloat(pp2.data[0].highest_price);
  let quantity = parseFloat(pp2.data[0].quantity);

  console.log('curr_price: '+curr_price);
  console.log('lowest_price: '+lowest_price);
  console.log('highest_price: '+highest_price);
  console.log('quantity: '+quantity);


  let status = await is_open()

  if(status){
    //  Продавай
    console.log('in sell')
    if(curr_price > highest_price){
      console.log('Продаю')
      await order('sell', quantity)
      // Меняю статус позиции
      let pp = await axios.post(host+'/position', {status: 'close'})
      //Лог продажи
    }else{
      console.log('no buy')
    }
  }else{
    ///Покупаю
    console.log('in buy')
    if(curr_price < lowest_price){
      console.log('Покупаю')
      await order('buy', quantity)
      // Меняю статус позиции
      let pp = await axios.post(host+'/position', {status: 'open'})
    }else{
      cpnsole.log('no buy')
    }
  }
}) ()
