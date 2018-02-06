/**
 * Created by ciprian on 4/20/17.
 */
var formsSwarming = {
    submitForm: function (form) {
        this.form = form;
        this.swarm("submit");
    },
    submit:{
        node:"FormsAdapter",
        code:function(){
            var self  = this;
	        console.log("[forms.js][submitForm] New form added.");
	        submitForm(this.form,S(function(err,res){
                if(err){
                    self.err = err.message;
                    self.home('failed');
                }else{
                    self.home('formSubmitted');
                }
            }))
        }
    },

    submitFormAnswer:function(answers,formId){
        this.answer = answers;
        this.formId = formId;
        this.swarm("submitAnswer");
    },
    submitAnswer:{
        node:"FormsAdapter",
        code:function(){
            var self = this;
	        console.log("[forms.js][submitAnswer] New form answer added.");
	        submitAnswer(this.answer,this.formId,this.meta.userId,S(function(err,res){
                if(err){
                    self.err = err.message;
                    self.home('failed');
                }else{
                    self.home('answerSubmitted');
                }
            }))
        }
    },


    getIdForEmail:{
        node:"UsersManager",
        code:function(){
            var self = this;
	        console.log("[forms.js][getIdForEmail] Getting user id for email "+this.email+".");
            getUserId(this.email,S(function (err,userId) {
                if(err){
                    self.err = err.message;
                    self.home('failed')
                }else{
                    self.userId = userId;
                    self.filter = {"userId":userId};
                    self.swarm(self.finalDestination)
                }
            }))
        }
    },

    getUserZones:{
        node:"UsersManager",
        code:function(){
            var self = this;
	        console.log("[forms.js][getUserZones] Getting user zones for userId "+this.userId+".");
            zonesOfUser(this.userId,S(function(err,zones){
                if(err){
                    self.err = err.message;
                    self.home('failed');
                }else{

                    if(self.filter){
                        self.filter.zone = zones.map(function (zone) {return zone.zoneName;})
                    }else{
	                    self.filter = {"zone":zones.map(function(zone){return zone.zoneName;})};
                    }
                    if(self.finalDestination){
	                    self.filter = {"zone":zones.map(function(zone){return zone.zoneName;})};
	                    self.filter.is_active = true;
                    }
	                self.swarm("retrieveFilteredForms");
                }
            }))
        }
    },

    getAllForms:function () {
        this.swarm("retrieveAllForms");
    },

	retrieveAllForms:{
        node:"FormsAdapter",
        code:function () {
            var self = this;
	        console.log("[forms.js][retrieveAllForms] Getting all forms.");
	        retrieveForms({},S(function(err,result){
	            if(err){
			        self.err = err.message;
			        self.home('failed');
		        }
		        else{
			        self.forms = result;
			        self.home("getAllFormsDone");
		        }
	        }))
        }
    },


    retrieveForms:function(filter){
        //todo : impose access restrictions here
        if(!filter){
            this.userId = this.meta.userId;
            this.swarm("getUserZones");
        }
        else if(filter.userId){
            this.userId = filter.userId;
            this.swarm("getUserZones");
        }
        else if(filter.email){
            this.email = filter.email;
            this.finalDestination = "getUserZones";  //in getIdForEmail I must know that is the next phase
            this.swarm("getIdForEmail");
        }else if(filter.message == 'formRender'){
	        this.userId = this.meta.userId;
	        this.filter = {is_active:true};
	        this.swarm("getUserZones");
        }
        else{
            this.filter = filter;
            this.swarm("retrieveFilteredForms");
        }
	    console.log("[forms.js][retrieveForms] Getting forms with filter ",this.filter);
    },

    retrieveFilteredForms:{
        node:"FormsAdapter",
        code:function(){
            var self = this;
	        retrieveForms(self.filter,S(function(err,result){
                if(err){
                    self.err = err.message;
                    self.home('failed');
                }
                else{
                    self.forms = result;
                    self.home("gotForms");
                }
            }))
        }
    },

    retrieveAnswers:function(filter){
        if(!filter){
            this.filter = {"userId":this.meta.userId};
            this.swarm("retrieveFilteredAnswers");
        }
        else if(filter.userId){
            this.filter = filter;
            this.swarm("retrieveFilteredAnswers");
        }
        else if(filter.email){
            this.email = filter.email;
            this.finalDestination = "retrieveFilteredAnswers";  //in getIdForEmail I must know that is the next phase
            this.swarm("getIdForEmail")
        }
        else{
            this.filter = {};
            this.swarm("retrieveFilteredAnswers");
        }
	    console.log("[forms.js][retrieveAnswers] Getting answers with filter ",this.filter);
    },

    retrieveAnswersForm:function (title) {
        this.title = title;
        this.swarm("retrieveAnswerswUser");
    },

	retrieveAnswerswUser:{
        node: "FormsAdapter",
        code:function () {
            var self = this;
	        console.log("[forms.js][retrieveAnswerswUser] Getting answers with user (form: "+this.title+").");
	        retrieveAnswersWusers(this.title,S(function(err,answers){
		        if(err){
			        self.err = err.message;
			        self.home('failed');
		        }else{
			        self.answers = answers;
			        self.home("gotAnswersWusersDone");
		        }
	        }))

        }
    },

    retrieveFilteredAnswers:{
        node:"FormsAdapter",
        code:function () {
            var self = this;
            retrieveAnswers(this.filter,S(function(err,answers){
	            if(err){
                    self.err = err.message;
                    self.home('failed');
                }else{
                    self.answers = answers;
                    self.home("gotAnswers");
                }
            }))
        }
    }
};
formsSwarming;
