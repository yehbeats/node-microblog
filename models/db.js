//创建数据库连接

var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;

var database = {};

database.open = function(fn) {
	MongoClient.connect(settings.url, function(err, db) {
		if(fn !== 'undefined' && typeof fn == 'function') {
			fn(err, db);
		}
		database.close = function() {
			db.close();
		}
		console.log("Connectd correct");
	});
};

module.exports = database;