var mysql = require('mysql');
var apersistence = require('apersistence');
const crypto = require('crypto');
var flow = require('callflow');
var uuid = require('uuid');
var newsItem = {
	title: 'Test ap',
	body: "<p>Its a wonderful day in LA.</p>",
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
	}, function(err, result){
		if(err){
			console.log(err);
		}else{
			startSwarming();
		}
	});

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
					console.log("NEWS ITEM INSERTED INTO DB: ");

					var updateNewsItem = {
						__meta: {
							typeName: 'News',
							savedValues: {
								newsId: result.newsId,
								title: 'Test ap',
								body: '<p>Its a wonderful day in LA.</p>',
								image: 'http://google.com',
								author: 'admin@swarm.com',
								date: '1491396344107',
								is_active: 'true'
							}
						},
						newsId: result.newsId,
						title: 'Test apasdasd',
						body: '<p>Its a wonderful day in LAasdadsasd.</p>',
						image: 'http://google.com',
						author: 'admin@swarm.com',
						date: '1491396344107',
						is_active: "true"
					};

					console.log("========================== updateNews test ==========================");
					// TypeError: obj.__meta.getPK is not a function
					updateNews(updateNewsItem, function (err, result) {
						if (err) {
							console.log("ERR[updateNews]: ", err);
						} else {
							console.log("NEWS ITEM UPDATED INTO DB: ", result);
						}
					});
				}
			});
		}
	}

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
updateNews = function (newsObj, callback) {
	flow.create("update user", {
		begin: function () {
			self.persistence.lookup.async("News", newsObj.newsId, this.continue("updateNews"));
		},
		updateNews: function (err, news) {
			if (err) {
				callback(err, null);
			}
			else {
				if (self.persistence.isFresh(news)) {
					callback(new Error("News item with id " + newsObj.newsId + " does not exist"), null);
				}
				else {
					self.persistence.externalUpdate(news, newsObj);
					self.persistence.saveObject(news, this.continue("updateReport"));
				}
			}
		},
		updateReport: function (err, user) {
			callback(err, user);
		}
	})();
};



if (persistence) {
	self.persistence = persistence;
	registerModels();

} else {
	console.log("Connection failed.")
}
