const TelegramBot = require('node-telegram-bot-api');
const token = '566371232:AAF6lQWOTesT29mSgY_mIgHZWjF-G2aoA3c';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  fetch("https://www.newcreation.org.sg/ajax/get/daily-devotional").then(resp => resp.text()).then(text => console.log(text));
  bot.sendMessage(chatId, 'Received your message');
});