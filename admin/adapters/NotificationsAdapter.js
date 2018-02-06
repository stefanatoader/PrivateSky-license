var core = require("swarmcore");
var adapterName = "NotificationsAdapter";
core.createAdapter(adapterName);

var apersistence = require('apersistence');
var container = require("safebox").container;
var uuidGen = require('uuid');

var myCfg = getMyConfig(adapterName);
console.log("myCfg", myCfg);
var fcmKey = myCfg ? myCfg.fcmKey : undefined;

var Devices = "Devices";
var flow = require("callflow");
var ref = this;

var FCM = require('fcm-push');
var fcm = new FCM(fcmKey);

var registerModels = function () {
	ref.persistence.registerModel(Devices, {
		id: {
			type: "string",
			pk: true,
			index: true,
			length: 255
		},
		uuid: {
			type: "string",
			length: 255
		},
		registrationId: {
			type: "string",
			length: 255
		},
		platform:{
			type: "string",
			length: 255
		}
	}, function (err, model) {
		if (err) {
			console.log(err);
		}
	});
};


container.declareDependency(adapterName, ["mysqlPersistence"], function (outOfService, persistence) {
	if (!outOfService) {
		console.log(adapterName+": registering models");
		ref.persistence = persistence;
		registerModels();
	} else {
		console.log(adapterName+": disabled persistence");
	}
});

registerDevice = function(uuid, registrationId, platform, callback){
	console.log("entering");
	flow.create("register device", {
		begin: function () {
			console.log("begin");
			ref.persistence.filter(Devices, {uuid: uuid}, this.continue("updateDevice"));
		},
		updateDevice: function (err, devices) {
			console.log("updateDevice");
			if(err){
				//new device
				this.continue("insertDevice")();
			}else{
				if(!devices.length){
					//new device
					this.continue("insertDevice")();
				}else{
					var device = devices[0];
					//existing device
					if(device.registrationId != registrationId){
						var newRecord = JSON.parse(JSON.stringify(device));
						newRecord.registrationId = registrationId;
						newRecord.uuid = uuid;
						newRecord.registrationId = registrationId;
						console.log(newRecord);
						ref.persistence.externalUpdate(device, newRecord);
						ref.persistence.saveObject(device, this.continue("finish"));
					}else{
						this.continue("finish")();
					}
				}
			}
		},
		insertDevice: function (){
			console.log("insertDevice");
			var id = uuidGen.v1().split("-").join("");
			var self = this;
			var device = ref.persistence.lookup.async(Devices, id, function(err, device){
				if(err){
					self.continue("finish")(err);
				}else{
					var newRecord = {
						id: id,
						uuid: uuid,
						registrationId: registrationId,
						platform: platform
					};

					console.log(device);
					ref.persistence.externalUpdate(device, newRecord);
					console.log(device);
					ref.persistence.saveObject(device, self.continue("finish"));
				}
			});
		},
		finish: function(err, result){
			console.log("finish", err, result);
			callback(err, result);
		}
	})();
}

composeNotification = function(title, message, additionalData){
	return {
		// data: additionalData,
		notification: {
			title: title,
			body: message,
			sound: "default"
		}
	}
}

function extractReceivers(devices){
	var receivers = [];
	for(var i=0; i< devices.length; i++){
		receivers.push(devices[i].registrationId);
	}
	return receivers;
}

function deliverNotification(receivers, notification, callback){
	var notif = notification ? notification : {};
	var deliverTo = extractReceivers(receivers);
	notif.to  = "/topics/news";
	fcm.send(notif, callback);
}

sendNotification = function(notification, filter, callback){
	flow.create("send notification", {
		begin: function(){
			ref.persistence.filter.async(Devices, filter, this.continue("notify"));
		},
		notify: function(err, devices){
			//send notifications
			if(err){
				callback(err);
			}else{
				deliverNotification(devices, notification, callback);
			}
		}
	})();
}

