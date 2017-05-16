var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
var fs = require('fs');
var request = require('request');
var sql = require('mssql');

//---------------------------
// Bot Setup
//---------------------------

// Define SQL connection parameters
var dbConfig = {
	server: 'localhost',
	database: 'JARVISCHATBOT',
	user: 'sa',
	password: 'P@ssw0rd'
};

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//---------------------------------------------------
// Bot Intents
//---------------------------------------------------

var intents = new builder.IntentDialog();

// Setup link to QnA maker
var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: 'd9aed820-0da3-4755-9ad9-fc3303c09f5e',
	subscriptionKey: '37829f054b1d4a309cd71e33e2848108'
});

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3
});

// Detecting intents: FAQ vs helpdesk vs forex
bot.dialog('/', getIntentSQL);

function getIntentSQL(session) {
	var msg = session.message.text;
	sqlIntentCount(function(err, result) {
		if (err) { console.log(err); return; }

		var matched = 0;	
		for ( var i = 0; i < result.length; i++ ) {
			if (msg.match(RegExp(result[i].pattern, 'i'))) matched = i;
		}
		console.log('match: ' + matched);
		console.log(result[matched]);
		session.beginDialog(result[matched].intent);
	});
	
	
}

/*
intents.onDefault([
	function (session) {
		builder.Prompts.text(session, 'Choose to use FAQ or helpdesk');
	},
	function (session, results) {
		if (results.response == 'hi') {
			session.send('please work');
		}
	}

]);
*/
/*
intents.matches(/^faq/i, [
	function(session){
		builder.Prompts.text(session, 'Hi! Please enter your question');
	},
	function (session) {
		session.beginDialog('/faq');
		session.endDialog();
	},
	function (session) {
		session.endDialog();
	}
]);

intents.matches(/^helpdesk/i, [
	function (session) {
		session.beginDialog('/helpdesk');
	}
]);

intents.matches(/^forex/i, [
	function (session) {
		session.beginDialog('/forex');
	}
]);
*/

//---------------------
// Bot Dialogs
//---------------------

bot.dialog('/faq', basicQnAMakerDialog);

bot.dialog('/forex', [
	function(session) {
		builder.Prompts.text(session, 'Querying OCBC Forex API... Please be patient');
		var apiResponse = ocbcForexRequest();
		
		console.log(apiResponse);
	},
	function (session) {
		session.endDialog();
	}
]);

// Hardcoded helpdesk flow with JSON case details as output
// TODO: troublshooting + case details flow should be imported from external files (not hardcoded)
bot.dialog('/helpdesk', [
	function (session) {
		builder.Prompts.text(session, 'Hi! What do you need help with?');
	},
	function (session, results) {
		session.dialogData.caseTopic = results.response;
		builder.Prompts.text(session, 'printer troubleshooting step 1 (yes/no)');
	},
	function (session, results, skip) {
		console.log(results);
		if (results.response == 'yes')
			skip();
		else
			builder.Prompts.text(session, 'printer troubleshooting step 2 (yes/no)');
	},
	function(session, results) {
		if (results.response == 'yes') {
			builder.Prompts.text(session, 'Thanks for using this chatbot, hope it was useful');
			session.endDialog();
		}
		else
			builder.Prompts.text(session, 'Please create a helpdesk case by describing your problem');
	},
	function (session, results) {
		session.dialogData.caseDescription = results.response;
		console.log(session.dialogData);
		builder.Prompts.text(session, 'Please give us your location (e.g. TC1 Level 6 east)');
	},
	function (session, results) {
		session.dialogData.caseLocation = results.response;
		console.log(session.dialogData);
		fs.writeFile('TSD001.json', JSON.stringify(session.dialogData));
		builder.Prompts.text(session, 'Thanks for the information. A new case "TSD001" has been created, please wait for a follow-up from the helpdesk team');
		session.endDialog();
	}
]);

//-------------------
// Functions
// ------------------

function ocbcForexRequest() {
	var url = 'https://api.ocbc.com:8243/Forex/1.0';
	var headers = {
		"Accept": "application/json",
		"Authorization": "Bearer 0cca39e95fd1de76fb875dc48dadf6de"
	};
	console.log('querying ocbc forex api...');
	request({"url": url, "headers": headers}, function (err, httpResponse, body) {
		if (!err) {
			return body;
		}
	});
}

var sqlIntentCount = function (fn) {
	var pool = new sql.ConnectionPool(dbConfig, function (err) {
		if (err) { console.log(err); return; }

		var request = new sql.Request(pool);
		request.query('select * from tbl_intents', function (err, results) {
			if (err) { console.log(err); return; }
			
			result = results.recordsets[0];

			pool.close(function (err) {
				if (err) { console.log(err); return; }

				console.log('Closing pool connection...');
				return fn && fn(null, result);
			});
		});
	});
};
