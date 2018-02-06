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

var registerModels = function () {
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
	}, function(err, result){
		if(err){
			console.log(err);
		}else{
			startSwarming();
		}
	});

	var waitFor = 2;
	function startSwarming(){
		waitFor--;
		if(!waitFor){
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
		}
	}

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
	}, function(err, result){
		if(err){
			console.log(err);
		}else{
			startSwarming();
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


if (persistence) {
	self.persistence = persistence;
	registerModels();
} else {
	console.log("Connection failed.")
}
