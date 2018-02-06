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
			},
			{
				name: 'NO_USER',
				nice: 'No user access'
			},
			{
				name: 'emailServer',
				nice: 'Email server'
			}
		]
	)

	.constant('swarmLabels',
		{
			"zone": "The target users",
			"context": "Swarm Name",
			"subcontextType": "Swarm subcontext (usualy ctor)",
			"subcontext": "Swarm Constructor"
		}
	)

	.constant('swarmPredefinedValues',
		{
			"action": "execution",
			"contextType": "swarm"
		}
	)

	.constant('createRuleLabels',
		{
			"action": "Action",
			"zone": "User zone",
			"contextType": "Type of context",
			"context": "Context",
			"subcontextType": "Type of subcontext",
			"subcontext": "Subcontext"
		}
	)

	.constant('sweetAlertConfiguration',
		{
			title: "Delete rule",
			text: "Are you sure you delete this rule?",
			type: "error",
			showCancelButton: true,
			confirmButtonColor: "#5cb85c",
			confirmButtonText: "Delete it!",
			cancelButtonText: "Go back!",
			closeOnConfirm: true,
			closeOnCancel: true
		}
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