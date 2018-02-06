app.service('notifier', ['notifyDefaults', function (notifyDefaults) {
	$.notifyDefaults(notifyDefaults);

	var checkMessage = function (message) {
		if (!message) {
			return false;
		} else {
			return !(message && (message === '' || message === 'undefined'));
		}
	};

	this.error = function (message) {
		if (checkMessage(message)) {
			console.error(new Error(message));

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: message
			}, {
				type: 'danger'
			});
		}else{
			console.log(new Error("An error occured at displaying message."));

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: "An error occured!"
			}, {
				type: 'danger'
			});
		}
	};
	this.warning = function (message) {
		if (checkMessage(message)) {
			console.warn(message);

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: message
			}, {
				type: 'danger'
			});
		}else{
			console.log(new Error("An error occured at displaying message."));

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: "An error occured!"
			}, {
				type: 'danger'
			});
		}
	};
	this.info = function (message) {
		if (checkMessage(message)) {
			console.log(message);

			$.notify({
				icon: 'glyphicon glyphicon-info-sign',
				message: message
			},{
				type: 'info'
			});
		}else{
			console.log(new Error("An error occured at displaying message."));

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: "An error occured!"
			}, {
				type: 'danger'
			});
		}
	};
	this.success = function (message) {
		if (checkMessage(message)) {
			console.log(message);

			$.notify({
				icon: 'glyphicon glyphicon-ok',
				message: message
			}, {
				type: 'success'
			});
		}else{
			console.log(new Error("An error occured at displaying message."));

			$.notify({
				icon: 'glyphicon glyphicon-warning-sign',
				message: "An error occured!"
			}, {
				type: 'danger'
			});
		}
	};

}]);