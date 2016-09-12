var restify = require('restify');
var builder = require('botbuilder');

//adding luis ai
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=3441c805-65b1-4cc0-8b5e-e6c92b747ca8&subscription-key=c9ad898006c6426d95251f015167aaa1&q=');
var dialog  = new builder.IntentDialog({ recognizers: [recognizer] });

// Get secrets from server environment
var connector = new builder.ChatConnector({
   appId: process.env.MICROSOFT_APP_ID,
   appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Setup Restify Server
var server = restify.createServer();
// Handle Bot Framework messages
server.post('/api/messages', connector.listen());
// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));
server.listen(process.env.port|| process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});


// Create bot
var bot = new builder.UniversalBot(connector);
bot.dialog('/',dialog);

dialog.matches('ProductInfo', builder.DialogAction.send('Tata Sky Ltd is a joint venture between Tata Sons and 21st Century Fox.'));
dialog.matches('ProductLaunch', builder.DialogAction.send('Tata Sky satellite television service was launched on 8 August, 2006.'));
dialog.matches('SpecialFeatures', builder.DialogAction.send('Tata Sky Ltd is a joint venture between Tata Sons and 21st Century Fox.'));
dialog.matches('ProductWork', builder.DialogAction.send('Tata Sky uplinks all channels from broadcasters to its satellite (INSAT 4A). The satellite sends these channels in digital format to the mini-dish fixed outside your home. The mini-dish relays the channels to the set top box which decodes the channels and sends them to your television, giving you an unparalleled television viewing experience with DVD quality picture and CD quality sound.'));
dialog.matches('HDProductInfo', builder.DialogAction.send('Tata Sky HD gives you the unmatched experience of high-definition viewing right at your home. With the Tata Sky HD service you can enjoy 5.1 Surround Sound, 1080i resolution and 16:9 Aspect ratio that allows you to view incredibly vivid colours and images up to 5 times sharper. Click here to know more.'));
dialog.matches('Digitisation', builder.DialogAction.send("TV signals are currently distributed in the country in analog as well as in digital and terrestrial formats. A digital format provides better picture quality & sound and other benefits leading to a better quality service. Most cable operators in the country are providing analog TV service while all DTH operators are providing a digital TV service. Digitisation means that all cable TV households would receive digital TV signals through a Set Top Box. As part of Digitisation, every cable operator will be legally bound to transmit digital signals, which can be received at the subscriber's home, only through a Set Top Box, often called a STB."));
dialog.matches('RainFade', builder.DialogAction.send('A few minutes of outage might occur during rains. This phenomenon is called rain fade/rain outage and occurs in DTH platforms across the world. It will result in your television losing reception for some time. We have tried to cut down this time so it might happen only for one or two minutes each time. This too is automatically detected and gets corrected by itself.'));

