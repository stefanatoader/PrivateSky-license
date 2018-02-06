exports.forms = {
	identifier: "formId",
	data: [
		{
			formId: '4e5982c0-9136-11e7-8130-97af80fbfba2',
			title: "Event registration form",
			description: "Form for adding a new event.",
			is_active: true,
			modified: true,
			date: '1504504808684',
			zone: "ALL_USERS",
			structure: {
				"fields": [{"type": "text", "name": "image", "displayName": "Headline", "$$hashKey": "object:381", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length of this field is 100.", "pattern": "This field must be an URL type."}, "minlength": 0, "maxlength": 100, "pattern": "(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?"}, "placeholder": "Event's poster", "$_redraw": false},
					{"type": "text", "name": "location", "displayName": "Location", "$$hashKey": "object:591", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length of this field is 100."}, "minlength": 0, "maxlength": 100}, "placeholder": "Event's location", "$_redraw": false},
					{"type": "text", "name": "date", "displayName": "Time and date", "$$hashKey": "object:691", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length of this field is 100."}, "minlength": 0, "maxlength": 100}, "placeholder": "Event's time and date", "$_redraw": false}]
			}
		},
		{
			formId: '4e5982c0-9136-11e7-8130-97af80fbfba4',
			title: "Join event form",
			description: "Form for users to join an event",
			is_active: true,
			modified: true,
			date: '1504504808684',
			zone: "ALL_USERS",
			structure: {
				"fields": [{"type": "text", "name": "name", "displayName": "Name", "$$hashKey": "object:207", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length of this field is 50."}, "minlength": 0, "maxlength": 50}, "placeholder": "Your name", "$_redraw": false, "$_isDragging": false},
					{"type": "text","name": "email","displayName": "Email address","$$hashKey": "object:253","$_displayProperties": false,"$_invalid": false,"validation": {"messages": {"maxlength": "Maximum length of this field is 50."}, "minlength": 0, "maxlength": 50},"placeholder": "Your email","$_redraw": false},
					{"type": "text", "name": "phone", "displayName": "Phone", "$$hashKey": "object:605", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length of this field is 50."}, "minlength": 0, "maxlength": 50}, "placeholder": "Your phone number", "$_redraw": false},
					{"type": "number","name": "numberofpers","validation": {"maxlength": 2, "messages": {"min": "You can come alone", "max": "Maximum 10 persons with you", "maxlength": "Maximum length of this field is 2."}, "min": 0, "max": 10, "minlength": 0},"displayName": "Persons","$$hashKey": "object:805","$_displayProperties": false,"$_invalid": false,"placeholder": "Number of persons","$_redraw": false}]
			}
		},
		{
			formId: '4e5982c0-9136-11e7-8130-97af80fbfba5',
			title: "Not join answer model",
			description: "Form for cancelling join to a form",
			is_active: true,
			modified: true,
			date: '1504504808684',
			zone: "ALL_USERS",
			structure: {
				"fields": [{"type": "textarea", "name": "reason", "displayName": "Reason", "$$hashKey": "object:1027", "$_displayProperties": false, "$_invalid": false, "validation": {"messages": {"maxlength": "Maximum length for this field is 500."}, "minlength": 0, "maxlength": 500}, "placeholder": "Why are you cancelling?", "$_redraw": false}]
			}
		}
	]
};