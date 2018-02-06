/**
 * Created by ciprian on 4/20/17.
 */


var core = require("swarmcore");
thisAdapter = core.createAdapter("FormsAdapter");
var persistence = undefined;
var connection = undefined;
var container = require('safebox').container;
var uuid = require('node-uuid');
var apersistence = require('apersistence');

container.declareDependency("mysqlConn",['mysqlConnection'],function(outOfService,mysqlConnection){
	if(!outOfService){
		connection = mysqlConnection;
	}else{
		console.log("Could not make connection to MYSQL");
	}
});

container.declareDependency('formsAdapter',['mysqlPersistence'],function(outOfService,mysqlPersistence) {
    if (!outOfService) {
        persistence = mysqlPersistence;
        var models = [{
            modelName: "Form",
            structure: {
                formId:{
                    type: "string",
                    length: 255,
                    pk:true
                },
                title: {
                    type: "string",
                    length: 255
                },
                description: {
                    type: "string",
                    length: 255
                },
				is_active: {
					type: "boolean",
					default:true
				},
                modified: {
                    type: "boolean",
                    default:true
                },
				date: {
					type: "string",
					length: 255
				},
                zone: {
                    type: "string",
                    length: 255
                },
                structure: {
                    type: "JSON"
                }
            }
        },{
            modelName: "Answer",
            structure: {
                id:{
                    type: "string",
                    length: 255,
                    pk:true
                },
                userId: {
                    type: "string",
                    length: 255
                },
                formId: {
                    type: "string",
                    length: 255
                },
                answer: {
                    type: "JSON"
                }
            }
        }];

        models.forEach(function (model) {
            persistence.registerModel(model.modelName, model.structure, function (err, result) {
                if (err) {
                    console.log(err);
                }
            })
        })
    }
});

submitForm = function(form,callback){
    console.log(form);
    var dbForm = undefined;
    if(form.formId){
        persistence.filter("Form", {formId: form.formId}, function(err, result){
            if(err){
                callback(err);
            }else{
                if (result.length === 0) {
                    dbForm = apersistence.createRawObject("Form", uuid.v1());
                } else {
                    dbForm = result[0];
                }

                persistence.externalUpdate(dbForm,form);
                dbForm.date = Date.now();

                persistence.save(dbForm, callback);
            }
        })
    }else{
        dbForm = apersistence.createRawObject("Form", uuid.v1());
        persistence.externalUpdate(dbForm, form);
        dbForm.date = Date.now();
        persistence.save(dbForm, function(err, result){
            console.log(err, result);
            callback(err, result);
        });
    }
};

errorDisplay = function (message) {
  console.log(new Error(message));

  return "A new error message: "+message;
};

submitAnswer = function(answer,form,user,callback){
    persistence.filter("Answer",{"userId":user,"formId":form},function(err,result){
	    console.log(user, form);

	    if(err){
            callback(err)
        }else {
            var dbAnswer = undefined;
            if (result.length === 0) {
                dbAnswer = apersistence.createRawObject("Answer", uuid.v1());
                dbAnswer.formId = form;
                dbAnswer.userId = user;
            } else {
                dbAnswer = result[0]
            }
            dbAnswer.answer = answer;
            persistence.save(dbAnswer, callback);
        }
    })
};

retrieveAnswersWusers = function (title, callback) {
    //@todo : fix this security issue ( sqlInjection + remove salt and other critical info from swarm answer )
	connection.query("select * from Answer join DefaultUser on DefaultUser.userId = Answer.userId join Form on Form.formId = Answer.formId where Form.title='"+title+"'", callback);
};

retrieveForms = function(filter, callback){
    persistence.filter("Form", filter, callback);
};

retrieveAnswers = function(filter,callback){
    persistence.filter('Answer',filter,callback)
};
