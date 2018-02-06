exports.form = {
	formId: {
		type: "string",
		length: 255,
		pk: true
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
		default: true
	},
	modified: {
		type: "boolean",
		default: true
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
};