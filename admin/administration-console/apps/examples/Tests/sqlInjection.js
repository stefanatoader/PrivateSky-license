var mysql = require('mysql');
var apersistence = require('apersistence');
const crypto = require('crypto');
var flow = require('callflow');
var uuid = require('uuid');
var newsItem = {
	title: 'Test ap',
	body: "<p>It's a wonderful day in LA.</p>",
	is_active: 'true',
	image: 'http://google.com',
	author: 'admin@swarm.com'
};
var self = this;
var connectionSettings = {
	connectionLimit: 10,
	host: 'localhost',
	port: 3306,
	user: "root",
	password: "",
	database: "tests" // utf8_bin
};
var mysqlConnection = mysql.createPool(connectionSettings);
var persistence = apersistence.createMySqlPersistence(mysqlConnection);

function hashThisPassword(plainPassword, salt, callback) {
	crypto.pbkdf2(plainPassword, salt, 20000, 512, 'sha512', function (err, res) {
		if (err) {
			callback(err)
		}
		else {
			callback(undefined, res.toString('base64'));
		}
	});
}

var registerModels = function () {
	var waitFor = 1;
	function startSwarming(){
		waitFor--;
		if(!waitFor){
			console.log("========================== createNews test ==========================");
			// Error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 's a wonderful day in LA.</p> ....
			createNews(newsItem, function (err, result) {
				if (err) {
					console.log("ERR[createNews]: ", err);
				} else {
					console.log("NEWS ITEM INSERTED INTO DB: ", result);
				}
			});
		}
	}

	self.persistence.registerModel("News", {
		newsId: {
			type: "string",
			pk: true,
			index: true,
			length: 255
		},
		title: {
			type: "string",
			length: 255
		},
		body: {
			type: "string",
			length: 255
		},
		image: {
			type: "string",
			length: 255
		},
		author: {
			type: "string",
			index: true,
			length: 255
		},
		date: {
			type: "string",
			length: 255
		},
		is_active: {
			type: "boolean",
			default: true,
			length: 255
		}
	}, function (err, model) {
		if (err) {
			console.log(err);
		}else{
			startSwarming();
		}
	});
};

createNews = function (newsData, callback) {
	if (!newsData.newsId) {
		newsData.newsId = uuid.v1().split("-").join("");
	}
	var dateObject = new Date();
	newsData.date = dateObject.getTime();

	self.persistence.lookup("News", newsData.newsId, function (err, news) {
		if (err) {
			callback(err, null);
		} else if (!self.persistence.isFresh(news)) {
			callback(new Error("News item with id " + newsData.newsId + " already exists"));
		} else {
			self.persistence.externalUpdate(news, newsData);
			self.persistence.save(news, function (err, newsData) {
				if (err) {
					callback(err, null);
				} else {
					callback(undefined, news);
				}
			})
		}
	});
};

if (persistence) {
	self.persistence = persistence;
	registerModels();
} else {
	console.log("Connection failed.")
}
