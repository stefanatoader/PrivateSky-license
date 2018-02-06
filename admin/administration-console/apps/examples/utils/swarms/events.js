var eventsSwarm = {

	retrieveEvents: function (filter) {
		this.filter = filter === null ? {} : filter;
		this.swarm("retrieveFilteredEvents");
	},
	retrieveFilteredEvents:{
		node:"EventsAdapter",
		code:function () {
			var self = this;
			retrieveFilteredEvents(self.filter, S(function (err, res) {
				if(err){
					self.error = "Error at getting filtered events.";
					console.log(new Error(err.message));
					self.home('failed');
				}else{
					self.result = res;
					self.home('retrieveEventsDone');
				}
			}))
		}
	},

	retrieveStructure: function () {
		this.swarm("retrieveEventStructure");
	},
	retrieveEventStructure:{
		node:"EventsAdapter",
		code:function () {
			var self = this;
			retrieveEventStructure(S(function (err, res) {
				if(err){
					self.error = "Error at getting event structure.";
					console.log(new Error(err.message));
					self.home('failed');
				}else{
					self.result = res[0].structure;
					self.home('retrieveStructureDone');
				}
			}))
		}
	},

	submitEvent: function (event) {
		this.event = event;
		this.userId = this.getUserId();
		this.swarm("submit");
	},
	submit:{
		node:"EventsAdapter",
		code:function () {
			var self = this;
			submitEvent(self.event, self.userId, S(function (err, res) {
				if(err){
					self.error = "Error at adding the new event.";
					console.log(new Error(err.message));
					self.home('failed');
				}else{
					self.result = res;
					self.home('submitEventDone');
				}
			}))
		}
	},

	changeState : function (event) {
		this.event = event;
		this.swarm('changeEventState');
	},

	changeEventState:{
		node:'EventsAdapter',
		code:function () {
			var self = this;
			changeState(self.event, S(function (err, res) {
				if(err){
					self.error = "Error on changing states";
					console.log(new Error(err));
					self.home('failed');
				}else{
					self.result = res;
					self.home("changeStateDone");
				}
			}))
		}
	},

	attendeesCount:function (eventId) {
		this.eventId = eventId;
		this.swarm('getAttendeesCount');
	},

	getAttendeesCount:{
		node:"EventsAdapter",
		code:function () {
			var self = this;
			getAttendeesCount(self.eventId, S(function (err, res) {
				if(err){
					self.error = "Error on getting attendees count";
					console.log(new Error(err));
					self.home('failed');
				}else{
					self.result = res;
					self.home('getAttendeesCountDone');
				}
			}))
		}
	},

	interestedCount:function (eventId) {
		this.eventId = eventId;
		this.swarm('getInterestedCount');
	},

	getInterestedCount:{
		node:"EventsAdapter",
		code: function () {
			var self = this;
			getInterestedCount(self.eventId, S(function (err, res) {
				if(err){
					self.error="Error on getting interested count.";
					console.log(new Error(err));
					self.home('failed');
				}else{
					self.result = res;
					self.home('getInterestedCountDone');
				}
			}))
		}
	},

	comments: function (eventId) {
		this.eventId = eventId;
		this.swarm('getComments');
	},

	getComments:{
		node:"EventsAdapter",
		code:function () {
			var self = this;
			getComments(self.eventId, S(function (err, res) {
				console.log("preiau comentarii");

				if(err){
					self.error="Error on getting comments.";
					console.log(new Error(err));
					self.home('failed');
				}else{
					self.result = res;
					self.home("getEventsDone");
				}
			}))

		}
	},
	
	submitComments: function (commentObject) {
		this.commentObject = {};
		this.commentObject.eventId = commentObject.commentObject.eventId;
		this.commentObject.message = commentObject.commentObject.message;
		this.commentObject.userId = this.getUserId();
		this.commentObject.date = Date.now();

		console.log(this.commentObject);
		this.swarm("submitCommentPhase");
	},
	
	submitCommentPhase: {
		node: "EventsAdapter",
		code: function () {
			var self = this;
			submitComments(self.commentObject, function (err, res) {
				if(err){
					self.error = "Error on adding new comment.";
					console.log(new Error(err));
					self.home("failed");
				}else{
					self.result = res;
					self.home("submitCommentDone");
				}
			})
		}
	}
};

eventsSwarm;