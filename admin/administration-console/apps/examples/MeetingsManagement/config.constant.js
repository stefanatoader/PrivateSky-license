
angular.module('app')
	.constant('usersZones',
		[
			{
				name: 'Admin',
				nice: 'Administrator'
			},
			{
				name: 'ALL_USERS',
				nice: 'Member'
			},
			{
				name: 'Sponsor',
				nice: 'Sponsor'
			},
			{
				name: 'Organizator',
				nice: 'Organizator'
			},
			{
				name: 'Analysts',
				nice: 'Analyst'
			}
		]
	)

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

	.constant('defaultEventModels',[
		{
			title:"There are no events yet.",
			description:"Click below to add one.",
			state:'4',
			headline:"http://via.placeholder.com/1000x1000/d9edf7/d9edf7"
		},{
			title:"Add a new event",
			description:"",
			state:'4',
			headline: "http://via.placeholder.com/1000x1000/1c2b36/1c2b36"
		}
	])
	.constant('trimLength',50)
;