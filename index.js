const TelegramBot = require('node-telegram-bot-api');
const token = '566371232:AAF6lQWOTesT29mSgY_mIgHZWjF-G2aoA3c';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  request({url: 'https://www.newcreation.org.sg/ajax/get/daily-devotional', 'headers': 'headers'}, function(error, response, body) {
    

    var title = body.split("<h1")[1];
    var verse = title.split("<h4>")[1];
    var quote = verse.split("<h3>")[1];
    var message = quote.split("</blockquote>")[1];

    title = title.split("<p>")[1].split("<br>")[0];
    verse = verse.split("</h4>")[0];
    quote = quote.split("</h3>")[0].split("sup>");
    var number = quote[1].split("<")[0] + " ";
    quote = quote[2];
    message = message.split("</div>")[0];
    message = message.replace(/<p>/g, '');
    message = message.replace(/<\/p>/g, '');
    message = message.trim();
    message = entities.decode(message);
    
    title = "*" + title + "*\n";
    verse = verse + "\n";
    quote = "_" + quote + "_\n\n";
    

    console.log(title);
    console.log(verse);
    console.log(quote);
    console.log(message);

    var text = title + verse + number + quote + message;
    

    bot.sendMessage(chatId, text, {parse_mode: "Markdown"});

  })
});