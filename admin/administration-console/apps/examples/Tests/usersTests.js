var mysql = require('mysql');
var apersistence = require('apersistence');
const crypto = require('crypto');
var flow = require('callflow');
var uuid = require('uuid');

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
	}, function (err, model) {
		if (err) {
			console.log(err);
		}
	});

	self.persistence.registerModel("Organisation", {
		organisationId: {
			type: "string",
			pk: true,
			index: true,
			length: 255
		},
		displayName: {
			type: "string",
			length: 255
		},
		agent: {
			/* numele de grup al agentului */
			type: "string",
			length: 255
		}
	}, function (err, model) {
		if (err) {
			console.log(err);
		}
	});

	/*
	 Default User model
	 */

	self.persistence.registerModel("DefaultUser", {
		userId: {
			type: "string",
			pk: true,
			index: true,
			length: 255
		},
		organisationId: {
			type: "string",
			index: true,
			length: 255
		},
		password: {
			type: "string",
			length: 1024
		},
		firstName: {
			type: "string",
			length: 255
		},
		lastName: {
			type: "string",
			length: 255
		},
		username: {
			type: "string",
			length: 255
		},
		email: {
			type: "string",
			index: true,
			length: 255
		},
		is_active: {
			type: "string",
			default: "false",
			length: 255
		},
		zones: {
			type: "string",
			default: "public",
			length: 255
		},
		salt: {
			type: "string",
			length: 255
		},
		activationCode: {
			type: "string",
			index: true,
			default: "0",
			length: 255
		}
	}, function (err, model) {
		if (err) {
			console.log(err);
		}
	});
};

createUser = function (userData, callback) {
	self.persistence.filter("DefaultUser", {"email": userData.email}, function (err, result) {
		if (err) {
			callback(err, null)
		} else if (result.length > 0) {
			callback(new Error("User with email " + userData.email + " already exists"), null);
		} else {
			if (!userData.userId) {
				userData.userId = uuid.v1().split("-").join("");
			}
			self.persistence.lookup("DefaultUser", userData.userId, function (err, user) {
				if (err) {
					callback(err, null)
				} else if (!self.persistence.isFresh(user)) {
					callback(new Error("User with id " + userData.userId + " already exists"), null);
				} else {
					userData.salt = crypto.randomBytes(48).toString('base64');
					user.salt = userData.salt;
					hashThisPassword(userData.password, userData.salt, function (err, hashedPassword) {
						userData.password = hashedPassword;
						self.persistence.externalUpdate(user, userData);
						self.persistence.save(user, function (err, newUser) {
							if (err) {
								callback(err)
							} else {
								delete user['password'];
								callback(undefined, user);
							}
						})
					});
				}
			});
		}
	});
};
updateUser = function (userJsonObj, callback) {
	flow.create("update user", {
		begin: function () {
			self.persistence.lookup.async("DefaultUser", userJsonObj.userId, this.continue("updateUser"));
		},
		updateUser: function (err, user) {
			if (err) {
				callback(err, null);
			}
			else {
				if (self.persistence.isFresh(user)) {
					callback(new Error("User with id " + userJsonObj.userId + " does not exist"), null);
				}
				else {
					var self = this;

					if (userJsonObj.__meta.savedValues.password != userJsonObj.password) {
						hashThisPassword(userJsonObj.password, userJsonObj.salt, function (err, hashedPassword) {
							userJsonObj.password = hashedPassword;
							self.persistence.externalUpdate(user, userJsonObj);
							self.persistence.saveObject(user, self.continue("updateReport"));
						});
					} else {
						self.persistence.externalUpdate(user, userJsonObj);
						self.persistence.saveObject(user, self.continue("updateReport"));
					}

				}
			}
		},
		updateReport: function (err, user) {
			callback(err, user);
		}
	})();
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

var newUserObj = {
	status: 'Active',
	firstName: 'John',
	lastName: 'Doe',
	email: 'john.doe@gmail.com',
	username: 'john.doe',
	password: 'swarm',
	zones: 'limited',
	is_active: 'true'
};

var updateUserObj = {
	userId: 'f2427b4019f311e7b5f1919c11edc670',
	firstName: 'Johnyfygggg',
	lastName: 'Doe',
	username: 'john.doe',
	email: 'john.doe@gmail.com',
	is_active: 'true',
	zones: 'limited',
	activationCode: '0'
};

var newsItem = {
	title: 'Test ap',
	body: '<p>Its a wonderful day in LA.</p>',
	is_active: 'true',
	image: 'http://google.com',
	author: 'admin@swarm.com'
};

if (persistence) {
	self.persistence = persistence;

	registerModels();

	console.log("========================== createUser test ==========================");
	/* ERR[updateUser]:  { [Error: ER_NO_SUCH_TABLE: Table 'tests.defaultuser' doesn't exist]
	 code: 'ER_NO_SUCH_TABLE',
	 errno: 1146,
	 sqlState: '42S02',
	 index: 0 }

	 temporary fix: repornirea aplicatiei...
	 */
	createUser(newUserObj, function (err, result) {
		if (err) {
			console.log("ERR[createUser]: ", err);
		} else {
			console.log("USER INSERTED INTO DB: ", result);
		}
	});

	console.log("========================== updateUser test ==========================");
	// [TypeError: Cannot read property 'persistence' of undefined]
	updateUser(updateUserObj, function (err, result) {
		if (err) {
			console.log("ERR[updateUser]: ", err);
		} else {
			console.log("USER UPDATED INTO DB: ", result);
		}
	});

	console.log("========================== createNews test ==========================");
	// Error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 's a wonderful day in LA.</p> ....
	createNews(newsItem, function (err, result) {
		if (err) {
			console.log("ERR[createNews]: ", err);
		} else {
			console.log("NEWS ITEM INSERTED INTO DB: ", result);

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

} else {
	console.log("Connection failed.")
}
