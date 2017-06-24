/* jshint loopfunc: true */
/* jshint esversion: 6 */

var restify = require('restify');
var builder = require('botbuilder');
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

var recognizer = new builder.LuisRecognizer('http://localhost:5000/parse?');
var intents = new builder.IntentDialog({ 'recognizers': [recognizer] });

var intentList = [];
var dialogList = {};

getIntentList(function(err, result) {
	if (err) { console.log(err); return; }
	if (result.length < 1) { console.log('No intents extracted'); return; }

	console.log('Intents extracted successfully');
	for (var i = 0; i < result.length; i++) {
		intentList.push(result[i].intent);
	}
	console.log('intents detected: ' + intentList);
	
	// Build intent recogniser
	intents.matchesAny(intentList, [
		function(session, args) {
			var topIntent = args.intents[0];
			session.send('TOP INTENT DETECTED IS: ' + topIntent.intent + ' WITH A SCORE OF ' + topIntent.score);
			session.beginDialog(topIntent.intent, dialogList[topIntent.intent]);
			/*
			sqlGetDialogStep(topIntent.intent, 2, function(err, result) {
				session.endDialog();
			});
			*/
		}
	]);

	// start querying and building dialogs
	for (var k in intentList) {
		createDialogList(k);
	}
});


bot.dialog('/', intents);

intents.onDefault([
	function (session, args, next) {
		session.send('Sorry your query was not recognized, please try another question');
	}
]);
/*
intents.matchesAny(intentList, [
	function(session, args) {
		var topIntent = args.intents[0];
		session.send('TOP INTENT DETECTED IS: ' + topIntent.intent + ' WITH A SCORE OF ' + topIntent.score);
		var query = "select * from tbl_dialog where intent = '" + topIntent.intent + "' order by step" ; 
		console.log(query);
		sqlGetDialogStep(query, function(err, result) {
			console.log(result);
			session.endDialog();
		});
	}
]);
*/
/*
intents.matches('ss_printer_setup', [
	function(session, args) {
		console.log(args);
		session.send('Printer setupp!!!');
		session.beginDialog('ss_printer_setup');
	}
]);
*/
//----------------------------
// Bot Dialogs
//---------------------------

bot.dialog('/greet', [
	function(session) {
		session.send('Hi! How are you!');
		session.endDialog();
	}
]);

//------------------
// Functions
//------------------

function getIntentList(cb) {
	console.log("Begin extracting intent list");
	var pool = new sql.ConnectionPool(dbConfig, function(err) {
		if (err) { console.log(err); return; }

		var request = new sql.Request(pool);
		var query = "select distinct intent from tbl_dialog";
		request.query(query, function(err, results) {
			if (err) { console.log(err); return; }
			result = results.recordset;

			pool.close(function(err) {
				if (err) { console.log(err); return; }

				return cb && cb(null, result);
			});
		});
	});
}

function sqlGetDialogStep(intent, step, fn) {
	var pool = new sql.ConnectionPool(dbConfig, function (err) {
		if (err) { console.log(err); return; }

		var request = new sql.Request(pool);
		var query = "select * from tbl_dialog where intent = '" + intent + "' and step = " + step; 
		request.query(query, function (err, results) {
			if (err) { console.log(err); return; }
			result = results.recordsets[0][0];

			pool.close(function (err) {
				if (err) { console.log(err); return; }

				console.log('Closing pool connection...');
				return fn && fn(null,result);
			});
		});
	});
}

function sqlGetDialog(intent, fn) {
	var pool = new sql.ConnectionPool(dbConfig, function (err) {
		if (err) { console.log(err); return; }

		var request = new sql.Request(pool);
		//var query = "select count (step) from tbl_dialog where intent ='" + intent + "'"; 
		var query = "select * from tbl_dialog where intent = '" + intent + "' order by step asc";
		request.query(query, function (err, results) {
			if (err) { console.log(err); return; }
			result = results.recordsets[0];

			pool.close(function (err) {
				if (err) { console.log(err); return; }

				return fn && fn(null,result);
			});
		});
	});
}


var dialogListTracker = 0;
function createDialogList(k){
	sqlGetDialog(intentList[k], function(err, result) {
		// create the dialog array for each intent
		for (var i in result) {
			dialogList[result[i].intent] = [];
		}
		// push details to dialog array
		for (var j = 0; j < result.length; j++) {
			var dialogRow = {};
			dialogRow.intent = result[j].intent;
			dialogRow.step = result[j].step;
			dialogRow.text = result[j].text;
			dialogRow.attachment = result[j].attachment_url;
			dialogList[result[j].intent].push(dialogRow);
			if (Object.keys(dialogList).length == intentList.length &&
				j == result.length - 1) {
				createBotDialogs(dialogList);
			}
			//if (k == intentList.length - 1 && j == result.length - 1)
				//console.log(k + " " + j);
		}
	});
}

function createBotDialogs(dialogList) {
	for (var dia in dialogList) {
		createPromptsFromObj(dialogList[dia]);
	}
}

function createPromptsFromObj(obj) {
	var dialogFunction = [];
	for (var i = 0; i <= obj.length; i++) {
		if (i === 0) {
			dialogFunction.push(function(session, args) {
				session.dialogData.step = 0;
				session.dialogData.data = args;
				builder.Prompts.text(session, session.dialogData.data[session.dialogData.step].text);
			});
		} else if (i < obj.length) {
			dialogFunction.push(function(session, results) {
				session.dialogData.step++;
				builder.Prompts.text(session, session.dialogData.data[session.dialogData.step].text);
			});
		}
		if (i == obj.length - 1) {
			dialogFunction.push(function(session, results) {
				builder.Prompts.text(session, "Tell us if this was helpful");
			});
		}
		if (i == obj.length) {
			dialogFunction.push(function(session, results) {
				session.send("Type another question for self service guide");
				session.endDialog();
			});
			bot.dialog(obj[0].intent, dialogFunction);
			console.log("Created dialog for intent '" + obj[0].intent + "'");
		}
	}
}
