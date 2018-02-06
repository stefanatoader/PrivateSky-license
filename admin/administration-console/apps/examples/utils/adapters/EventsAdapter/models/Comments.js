exports.comments = {
	commentId: {
		type: "string",
		length: 255,
		pk: true
	},
	authorId:{
		type:"string",
		length:255
	},
	user:{
		type: "DefaultUser",
		relation:"authorId:userId"
	},
	eventId:{
		type: "string",
		length: 255
	},
	message:{
		type: "textString"
	},
	date: {
		type: "string",
		length: 255
	}
};