var restify = require('restify');
var builder = require('botbuilder');

//adding luis ai
//var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=3441c805-65b1-4cc0-8b5e-e6c92b747ca8&subscription-key=c9ad898006c6426d95251f015167aaa1&q=');
//var dialog  = new builder.IntentDialog({ recognizers: [recognizer] });

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
bot.dialog('/', function (session) {
    session.send("You said " + session.message.text);
});
