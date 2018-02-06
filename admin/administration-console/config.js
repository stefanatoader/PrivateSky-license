function Config(){
	return {
		title: "PrivateSky Administration",
		brand: "Admin Console",
		mobileDebug: true,
		swarmClient: {
			host: "localhost",
			port: 8081,
			tenant: "admin"
		},
		/*notification:{
			android: {
				senderID: "177624908435"
			},
			browser: {
				pushServiceURL: 'https://fcm.googleapis.com/fcm/send'
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			}
		},*/
		urlSync: true,
		urlHistorySize: 10,
		password_min_size: 4
	};
};

function NotifyCfg(){
	return {
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
	};
};