exports.event = {
	eventId: {
		type: "string",
		length: 255,
		pk: true
	},
	userId:{
		type: "string",
		length:255
	},
	title:{
		type: "string",
		length: 255
	},
	description:{
		type: "textString"
	},
	headline:{
		type:"string",
		length:255
	},
	state: {
		type: "string",
		length: 255
	},
	date: {
		type: "string",
		length: 255
	},
	structure: {
		type: "JSON"
	}
};