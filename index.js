const TelegramBot = require('node-telegram-bot-api');
const credentials = require('./config');
const token = credentials.token;
const bot = new TelegramBot(token, {polling: true});
const request = require('request');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const firebase = require('firebase');

firebase.initializeApp({
  databaseURL: credentials.databaseURL
})
const subscriptions = firebase.database().ref('subscriptions');

setInterval(checkDaily, 3600000);

bot.onText(/\/devo/, (msg) => {
  const chatId = msg.chat.id;
  request({url: 'https://www.newcreation.org.sg/ajax/get/daily-devotional', 'headers': 'headers'}, function(error, response, body) {
    var text = parseDevo(body);
    bot.sendMessage(chatId, text, {parse_mode: "Markdown"});
  })
});

bot.onText(/\/sub/, (msg) => {
  const chatId = msg.chat.id;

  subscriptions.once('value', snap => {
    const obj = snap.val();
    if(obj) {
      const subs = Object.keys(obj).map(x => obj[x]);
      if(subs.includes(chatId)) {
        bot.sendMessage(chatId, "Already subscribed! Type /unsub if you want to unsubscribe.");
      } else {
        subscriptions.push(chatId);
        bot.sendMessage(chatId, "Subscribed!");
      }
    } else {
      subscriptions.push(chatId);
      bot.sendMessage(chatId, "Subscribed!");
    }
    
  })
})

bot.onText(/\/unsub/, (msg) => {
  const chatId = msg.chat.id;

  subscriptions.orderByValue().equalTo(chatId).once('value', snap => {
    
    if(snap.val()) {
      const obj = snap.val();
      const sub = Object.keys(obj);
      var updates = {};
      updates[sub] = null;
      subscriptions.update(updates);
      bot.sendMessage(chatId, "Unsubscribed!");
    } else {
      bot.sendMessage(chatId, "You are not subscribed!");
    }
  })
})

function checkDaily() {
  var date = new Date();
  var hour = date.getHours();
  if(hour == 0) {
    subscriptions.once('value', snap => {
      const obj = snap.val();
      if(obj) {
        const subs = Object.keys(obj).map(x => obj[x]);
        request({url: 'https://www.newcreation.org.sg/ajax/get/daily-devotional', 'headers': 'headers'}, function(error, response, body) {
          var text = parseDevo(body);
          subs.map(x => {
            bot.sendMessage(x, text, {parse_mode: "Markdown"});
          })
        })
      }
      
    })
  }
}


function parseDevo(body) {
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

  var credits = "\n\nDaily devotional from https://www.newcreation.org.sg/resources/#daily-devotional"

  var text = title + verse + number + quote + message + credits;
  return text;
}