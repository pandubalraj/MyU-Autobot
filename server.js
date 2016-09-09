var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var connector = new builder.ChatConnector({
    appId: '17b4a6fa-5d57-4183-b486-150fe8e36f22', 
    appSecret: 'ByWDWjABFMgHe8uORjtQ6Pa' 
});

//adding luis ai
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=3441c805-65b1-4cc0-8b5e-e6c92b747ca8&subscription-key=c9ad898006c6426d95251f015167aaa1&q=');
var dialog  = new builder.IntentDialog({ recognizers: [recognizer] });

// Create bot
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
    //respond with user's message
    session.send("You said " + session.message.text);
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages',bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
