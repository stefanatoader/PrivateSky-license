exports.answer = {
	id: {
		type: "string",
		length: 255,
		pk: true
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
};