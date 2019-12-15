
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.tg_token;
const host = process.env.binance_host;
console.log(host)

const bot = new TelegramBot(token, {polling: true});

  const update_info = async (i_text, h_tag) => {
        const chatId = i_text.chat.id;
        let hp = i_text.text.replace(h_tag, '');
        let ddd = h_tag.replace('#', '');
        hp = hp.replace(',', '.');
        hp = hp.trim()
        hp = parseFloat(hp)
        console.log(hp)
        console.log(ddd)
        console.log(chatId)
        try {
            let pp1 = await axios.post(host+'/position', {[ddd]: hp})
            console.log(pp1)
            bot.sendMessage(chatId, ddd+' изменена на'+hp);
        } catch (error) {
            bot.sendMessage(chatId, 'Что-то пошло не так');
            console.log('errrr')
        }
  }

  bot.onText(/\/echo (.+)/, (msg, match) => {
    console.log('aaaaaaaaaaaa')
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message',async (msg) =>  {

    if(msg.text.includes('#highest_price')){
        update_info(msg, '#highest_price')
    }else if(msg.text.includes('#lowest_price')){
        update_info(msg, '#lowest_price')
    }else if(msg.text.includes('#quantity')){
        update_info(msg, '#quantity')
    }
    else{
        bot.sendMessage(chatId, 'Nothing to change');
    }
  });
