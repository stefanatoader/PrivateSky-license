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

	.constant('notifyDefaults', {
		placement: {
			from: "bottom",
			align: "center"
		},
		animate: {
			enter: "animated fadeInUp",
			exit: "animated fadeOutDown"
		},
		allow_dismiss: true,
		element: 'body',
		timer: 1000,
		delay: 3000,
		offset: {
			y: 10,
			x: 0
		}
	})
;