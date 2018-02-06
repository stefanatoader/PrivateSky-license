var core = require("swarmcore");
thisAdapter = core.createAdapter("EventsAdapter");
var interface = require("./initModels").interface;
var apersistence = interface.apersistence;
var persistence = interface.persistence;
var uuid = require('node-uuid');
var commentsLimit = 5;

retrieveFilteredEvents = function (filter, callback) {
	persistence.filter("Event", filter, callback);
};

retrieveEventStructure = function (callback) {
	persistence.filter("Form", {formId: '4e5982c0-9136-11e7-8130-97af80fbfba2'}, callback);
};

submitEvent = function (event, userId, callback) {
	var dbEvent = undefined;
	if (event.eventId) {
		persistence.filter("Event", {eventId: event.eventId}, function (err, result) {
			if (err) {
				callback(err, null);
			} else {
				if (result.length === 0) {
					dbEvent = apersistence.createRawObject("Event", uuid.v1());
				} else {
					dbEvent = result[0];
				}

				persistence.externalUpdate(dbEvent, event);
				dbEvent.state = '1';
				persistence.save(dbEvent, callback);
			}
		})
	} else {
		dbEvent = apersistence.createRawObject("Event", uuid.v1());
		persistence.externalUpdate(dbEvent, event);
		dbEvent.state = 1;
		dbEvent.userId = userId;
		dbEvent.date = Date.now();
		persistence.save(dbEvent, callback);
	}
};

changeState = function (event, callback) {
	var dbEvent = undefined;
	if (event.eventId) {
		persistence.filter("Event", {eventId: event.eventId}, function (err, result) {
			if (err) {
				callback(err, null);
			} else {
				if (result.length === 0) {
					dbEvent = apersistence.createRawObject("Event", uuid.v1());
				} else {
					dbEvent = result[0];
				}

				persistence.externalUpdate(dbEvent, event);
				dbEvent.state = event.state;
				persistence.save(dbEvent, callback);
			}
		})
	} else {
		callback(new Error('no eventId here'), null);
	}
};

getAttendeesCount = function (eventId, callback) {
	persistence.filter("Attendees", {eventId: eventId}, function (err, res) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, res.length);
		}
	});
};

getInterestedCount = function (eventId, callback) {
	persistence.filter("Interests", {eventId: eventId}, function (err, res) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, res.length);
		}
	});
};

getComments = function (eventId, callback) {
	var comentarii=[];
	var errors=[];
	persistence.filter("Comments", {eventId: eventId}, function (err, res) {
		if(err){
			console.log("Errrrr", err);
			callback(err);
		}else{
			var maxlength = res.length;

			for(var i=0; i<maxlength; i++){
				console.log(res[i].user);
				res[i].__meta.loadLazyField("user", function(err, field){
					console.log(res[i].user);
					/*if(err){
						console.log(err);
					}
					if(i==maxlength){
						console.log(res);
						callback(null, res);
					}*/
				});
			}
			callback(err, res);
			// var limita = (maxlength > commentsLimit ) ? commentsLimit : maxlength;
			// for(var i = limita-1; i>0;i--){
			// 	if(res[i] && res[i].userId){
			// 		persistence.findById("DefaultUser",res[i].userId,function (error, result) {
			// 			if(error){
			// 				callback(error, null);
			// 			}else{
			// 				var comentariu = {
			// 					message : res[i].message,
			// 					date: res[i].date,
			// 					user: {
			// 						name : result.firstName + " " + result.lastName,
			// 						email : result.email,
			// 						avatar: result.avatar
			// 					}
			// 				};
			// 				comentarii.push(comentariu);
			// 			}
			// 			if(i == 0){
			// 				callback(null, comentarii);
			// 			}
			// 		});
			// 	}
			//
			//
			// }


		}
	});
};

submitComments = function (commentObject, callback) {
	var dbComm = apersistence.createRawObject("Comments", uuid.v1());
	persistence.externalUpdate(dbComm, commentObject);
	persistence.save(dbComm, callback);
};