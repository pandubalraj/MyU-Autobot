var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var connector = new builder.ChatConnector({
    appId: '17b4a6fa-5d57-4183-b486-150fe8e36f22', 
    appSecret: 'ByWDWjABFMgHe8uORjtQ6Pa' 
};

// Create bot
var bot = new builder.UniversalBot(connector);
bot.add('/', function (session) {
    
    //respond with user's message
    session.send("You said " + session.message.text);
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
