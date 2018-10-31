const TelegramBot = require('node-telegram-bot-api');
const token = '566371232:AAF6lQWOTesT29mSgY_mIgHZWjF-G2aoA3c';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  request({url: 'https://www.newcreation.org.sg/ajax/get/daily-devotional', 'headers': 'headers'}, function(error, response, body) {
    


    var split = body.split("h1");
    var title = split[1].split("<p>")[1].split("<br>")[0];
    split = split[2].split("<h4>");
    split = split[1].split("</h4>");
    var verse = split[0];
    var quote = split[1];
    
    console.log(title);

    // var verse = body.split("<h4>")[1].split("</h4>")[0];
    console.log(verse);
    console.log(quote);
    

  })
  // fetch("https://www.newcreation.org.sg/ajax/get/daily-devotional").then(resp => resp.text()).then(text => console.log(text));
  bot.sendMessage(chatId, 'Received your message');
});