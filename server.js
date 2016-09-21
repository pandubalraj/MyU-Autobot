var restify = require('restify');
var builder = require('botbuilder');
// var sourceFile = require('./sourceFile');

//luis ai app model for TATA SKY
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=3441c805-65b1-4cc0-8b5e-e6c92b747ca8&subscription-key=c9ad898006c6426d95251f015167aaa1&q=');
var dialog  = new builder.IntentDialog({ recognizers: [recognizer] });

// Get secrets from server environment
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
// // // Setup Restify Server
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

var carRegNo;
var name;
var carModel;
var carCost;

// Create bot root dialog
bot.dialog('/', [
   function (session) {
    builder.Prompts.text(session, 'Hi! Welcome to Auto Insurance Chat! \n May I know your good name please..');
   },
    function (session, results) {
    if (results.response) {
        name = results.response;
        session.send("Welcome %s \n Please answer following few questions, so we can quickly get a quote that suits you!",name);
        session.beginDialog('/getModel');
        }
    
    }
]);

bot.dialog('/getModel', [
    function (session) {
        builder.Prompts.choice(session, 'What is the model of you car?',["Audi","BWM","Maruti Suzuki","Porsche","Lexus","Ford","Honda","Hyundai","Tata"]);
    },
    function (session, results) {
        if (results.response) {
            carModel = results.response['entity'];
            session.send("Wow !!! You have %s ... Its a nice car", carModel);
            session.beginDialog('/getCost');
        } else {
            session.send('Please prompt valid car model...');
            session.beginDialog('/getModel');
        }
    }
]);

bot.dialog('/getCost', [
    function (session, args) {
        builder.Prompts.number(session,'What is the price of your car?');
    },
    function (session, results) {
        if (results.response) {
            carCost =  results.response;
        }
        session.beginDialog('/getRegNo');
    }
]);

bot.dialog('/getRegNo', [
    function (session) {
        builder.Prompts.text(session,'Can you please share the registration number. Please find below the sample image for RTO no.');
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.team-bhp.com/forum/attachments/indian-car-scene/164039d1248451018t-high-security-registration-plates-hsrp-india-dsc_6975.jpg"
            }]);
        session.endDialog(msg);
    },    
    function (session, results) {
        if (results.response) {
        carRegNo = results.response;
        session.beginDialog('/getClaim');
        }
    }
]);

bot.dialog('/picture', [
    function (session) {
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.team-bhp.com/forum/attachments/indian-car-scene/164039d1248451018t-high-security-registration-plates-hsrp-india-dsc_6975.jpg"
            }]);
        session.endDialog(msg);
    }
]);

bot.dialog('/getClaim', [
    function (session) {
        builder.Prompts.confirm(session,'Did you do any claim last year.');
    },    
    function (session, results) {
            // session.send('Good you have not claimed till now.')
            session.send('Find your details here \n Car Model: %s',carModel);
            session.send('\n Car Cost: %s',carCost);
            session.send('\n Car RegNo: %s',carRegNo);
    }
]);

// =============================================================================================
// DIALOG FOR TATA SKY 
// dialog.matches('ProductInfo', builder.DialogAction.send('Tata Sky Ltd is a joint venture between Tata Sons and 21st Century Fox.'));
// dialog.matches('ProductLaunch', builder.DialogAction.send('Tata Sky satellite television service was launched on 8 August, 2006.'));
// dialog.matches('SpecialFeatures', builder.DialogAction.send('Tata Sky enhances your TV viewing experiences with the following features: Guide: Browse through the 4-day schedule which includes the programme synopsis for all channels on Tata Sky. Reminder: This feature allows you to set a reminder for your favourite programmes up to 4 days in advance, ensuring you never miss an episode of your favourite show again. Favourites: You can set up to 50 channels in the order of your preference as a part of your favourites list. Search & Scan Banner: This feature allows you to check out what’s playing on another channel without changing the channel you are currently watching.The banner appears at the base of the television screen and does not interfere with what you are watching. It disappears automatically after giving you the schedule of programmes across all channels. Parental Control: You can regulate what your children watch with Tata Sky‘s parental control feature. This unique feature allows you to lock movies based on parental ratings or even an entire channel. To do this, press ‘organiser’ button on your remote and select parental control.'));
// dialog.matches('ProductWork', builder.DialogAction.send('Tata Sky uplinks all channels from broadcasters to its satellite (INSAT 4A). The satellite sends these channels in digital format to the mini-dish fixed outside your home. The mini-dish relays the channels to the set top box which decodes the channels and sends them to your television, giving you an unparalleled television viewing experience with DVD quality picture and CD quality sound.'));
// dialog.matches('HDProductInfo', builder.DialogAction.send('Tata Sky HD gives you the unmatched experience of high-definition viewing right at your home. With the Tata Sky HD service you can enjoy 5.1 Surround Sound, 1080i resolution and 16:9 Aspect ratio that allows you to view incredibly vivid colours and images up to 5 times sharper. Click here to know more.'));
// dialog.matches('Digitisation', builder.DialogAction.send("TV signals are currently distributed in the country in analog as well as in digital and terrestrial formats. A digital format provides better picture quality & sound and other benefits leading to a better quality service. Most cable operators in the country are providing analog TV service while all DTH operators are providing a digital TV service. Digitisation means that all cable TV households would receive digital TV signals through a Set Top Box. As part of Digitisation, every cable operator will be legally bound to transmit digital signals, which can be received at the subscriber's home, only through a Set Top Box, often called a STB."));
// dialog.matches('RainFade', builder.DialogAction.send('A few minutes of outage might occur during rains. This phenomenon is called rain fade/rain outage and occurs in DTH platforms across the world. It will result in your television losing reception for some time. We have tried to cut down this time so it might happen only for one or two minutes each time. This too is automatically detected and gets corrected by itself.'));
// dialog.matches('optionsOrderTS', builder.DialogAction.send('You can order Tata Sky connection using any of the below mentioned convenient options: To order online via Credit Card or Cash on Delivery. For more details visit http://www.tatasky.com/wps/portal/TataSky/orderonline. To order a Multi TV connection give a missed call to 08961189611. To book a new Tata Sky connection, give a missed call to 074117 74117'));
// dialog.matches('APorderTS', builder.DialogAction.send('To find the list of Authorized Partners in your area, please send an SMS "dl (space)(pincode)" to 56633. For eg. SMS dl 400025 to 56633.'));
// dialog.matches('DiscountOfferTS', builder.DialogAction.send('Tata Sky offers special discounts & additional benefits for consumers who purchase a Tata Sky connection from the website. For more details visit http://www.tatasky.com/wps/portal/TataSky/orderonline'));
// dialog.matches('upgradeTS', builder.DialogAction.send('You can upgrade your current set top box by either getting in touch with the Tata Sky Helpline or by visiting your nearest Tata Sky Authorized Partner. Please mention your subscriber ID while asking for an upgrade & check for offers at the time.'));
// dialog.matches('regSelfcare', builder.DialogAction.send('To register on Selfcare please visit www.mytatasky.com.'));
// dialog.matches('onlineAccMgmnt', builder.DialogAction.send('Yes, by registering yourself on Tata Sky selfcare you can manage your accounts online.'));
// dialog.matches('accCredInfo', builder.DialogAction.send('If the your bank account has been debited but the amount has not been recharged to your Tata Sky Account, due to a Submitted/Failure Status, it would take 7 to 10 working days for the amount to be credited back into your account.'));
// dialog.matches('rechargeDeno', builder.DialogAction.send('Recharge denominations are available from Rs 8 to Rs 9999. However, if you choose the option of recharging online through your debit card/credit card/net banking account on www.mytatasky.com you can recharge for any amount between Rs 8 to Rs 30,000.'));
// dialog.matches('typeRechargeAcc', builder.DialogAction.send('Recharge through ATM, Recharge through SMS, Auto Debit Facility, Recharge using your mobile, Recharge through your local Authorized Partner, Using Credit / Debit Cards or Net banking account.'));
// dialog.matches('None', builder.DialogAction.send('Oops!! You are asking out of my knowledge. Please wait let me get trained !'));



