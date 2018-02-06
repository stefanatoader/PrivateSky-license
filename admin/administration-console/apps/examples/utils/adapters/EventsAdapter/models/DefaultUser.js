var saltLength = 48;

exports.DefaultUser = {
	userId: {
		type: "string",
		pk: true,
		index: true,
		length:255
	},
	organisationId: {
		type: "string",
		index: true
	},
	password: {
		type: "string",
		length:1024
	},
	firstName: {
		type: "string",
		length: 255
	},
	lastName: {
		type: "string",
		length: 255
	},
	username: {
		type: "string",
		length: 255
	},
	email: {
		type: "string",
		index:true,
		length:255
	},
	is_active: {
		type: "boolean",
		default:true
	},
	zones:{
		type:"array:UserZoneMapping",
		relation:"userId:userId"
	},
	avatar: {
		type: "string",
		length: 255
	},
	salt:{
		type:"string",
		length:saltLength*2

	},
	activationCode:{
		type: "string",
		index:true,
		length:255,
		default:"0"
	}
};