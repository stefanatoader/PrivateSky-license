
angular.module('app')
	.constant('dateFormat','dd/MM/yyyy HH:mm:ss')
	.constant('newsPerPage',5)
	.constant('trimLength', 30) // how long should be the text body on news display
	.constant('notifyDefaults',{
		placement: {
			from: "bottom",
			align :"center"
		},
		animate:{
			enter: "animated fadeInUp",
			exit: "animated fadeOutDown"
		},
		allow_dismiss: true,
		element: 'body',
		timer: 1000,
		delay: 3000,
		offset:{
			y:10,
			x:0
		}
	})
;