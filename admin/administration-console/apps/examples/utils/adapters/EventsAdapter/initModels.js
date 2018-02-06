var container = require("safebox").container;
var apersistence = require('apersistence');
var interface = {container:container};

//initialize all models
container.declareDependency('persistence', ['mysqlPersistence'], function (outOfService, mysqlPersistence) {
	if (!outOfService) {
		interface.persistence = mysqlPersistence;
		interface.apersistence = apersistence;
		var modelsDictionary = require('./models').models;
		var counter = 0;
		for(var modelName in modelsDictionary){
			var model = modelsDictionary[modelName];
			counter++;
			interface.persistence.registerModel(modelName, model, function (err, result) {
				if (err) {
					console.log(err);
				}else{
					counter--;
					if(!counter){
						initialSetup();
					}
				}
			});
		}
		exports.interface = interface;
	}
});

//initialize default model data
var initialSetup = function(){
	var modelsData = require('./defaults').defaults;
	for(var modelName in modelsData){
		var modelDataDesc = modelsData[modelName];
		var identifier = modelDataDesc.identifier;
		var modelData = modelDataDesc.data;
		if(Array.isArray(modelData)){
			for(var i=0; i<modelData.length; i++){
				var data = modelData[i];
				insertingNewObject(data, data[identifier], modelName, function(err, result){
					if(err){
						console.log(new Error("Error on inserting new object."));
					}else{
						console.log("Object inserted on model " +modelName+".");
					}
				});
			}
		}else{
			console.log("modelDataDesc.data should be Array type.");
		}
	}
};


var insertingNewObject = function(object, identifier, modelName, callback) {
	var dbObject = undefined;
	interface.persistence.lookup(modelName, identifier, function (err, result) {
		if (err) {
			callback(err);
		} else {
			if (!result) {
				console.log("Inserting new "+modelName);
				dbObject = apersistence.createRawObject(modelName, identifier);
				interface.persistence.externalUpdate(dbObject, object);
				interface.persistence.save(dbObject, function (err, result) {
					callback(err, result);
				});
			} else {
				console.log("Object already existing. ("+identifier+")");
				callback(err, result);
			}
		}
	});
};