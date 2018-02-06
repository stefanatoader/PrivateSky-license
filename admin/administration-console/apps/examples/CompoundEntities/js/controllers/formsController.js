'use strict';
app.controller('formCreatorController', ['$scope', 'swarmHubService', 'ModalService', 'notifier', 'SweetAlert', 'usersZones', 'formsPermissions',
	function ($scope, swarmHubService, ModalService, notifier, SweetAlert, usersZones, formsPermissions) {

		var hub = swarmHubService.hub;
		$scope.formsPermissions = formsPermissions;


		hub.startSwarm("forms.js", "retrieveForms", {});
		hub.startSwarm("zones.js", "getAllZones");

		hub.on("forms.js", "failed", failed);
		hub.on("forms.js", "gotForms", gotForms);
		hub.on("zones.js", "failed", failed);
		hub.on("zones.js", "gotAllZones", gotAllZones);
		hub.on("forms.js", "formSubmitted", formSubmitted);


		$scope.form = {};
		$scope.forms = [];
		$scope.zones = [];
		$scope.fetching = true;

		$scope.humanReadableDate = humanReadableDate;
		$scope.modalForm = modalForm;

		/*  SWARM RESPONSES */
		function failed(swarm) {
			$scope.fetching = true;
			notifier.error("Error on fetching forms and zones.")
		}

		function gotForms(swarm) {
			$scope.fetching = false;
			$scope.forms = swarm.forms;
			$scope.$apply();
		}

		function gotAllZones(swarm) {
			$scope.zones = swarm.zones;
			$scope.$apply();
		}

		function formSubmitted(swarm) {
			if (swarm.form) {
				if (swarm.form.formId) { //edit mode
					$scope.forms.some(function (item) {
						if (item.formId === swarm.form) {
							for (var field in swarm.form) {
								item[field] = swarm.form[field];
							}
						}
					})
				} else {
					swarm.form.date = Date.now();
					$scope.forms.push(swarm.form);
				}
				SweetAlert.swal("Hooray!", "Your form is saved!", "success");
				$scope.$apply();
			}
		}

		/* SCOPE FUNCTIONS */
		$scope.humanReadableDate = humanReadableDate;

		function modalForm(form) {
			ModalService.showModal({
				templateUrl: "tpl/modalForm.html",
				controller: "modalFormController",
				inputs: {
					"form": form
				}
			}).then(function (modal) {
				modal.element.modal();
				modal.close.then(function (formData) {
					if (formData.formId) {
						for (var prop in formData) {
							form[prop] = formData[prop];
						}
						console.log(form);
					} else {
						console.log(formData);
					}
				})
			})

		}
	}]);

function humanReadableDate(item) {
	var dateObject = new Date(parseInt(item['date']));
	return jQuery.format.date(dateObject, "dd/MM/yyyy HH:mm:ss");
}

//================[ FORM NEWS CONTROLLER ]================
app.controller('modalFormController', ['$scope', 'form', '$element', 'close', 'notifier', 'swarmHubService', 'SweetAlert', 'formsPermissions',
	function ($scope, form, $element, close, notifier, swarmHubService, SweetAlert, formsPermissions) {

		$scope.formsPermissions = formsPermissions;
		var hub = swarmHubService.hub;
		hub.startSwarm("zones.js", "getAllZones");
		hub.on("zones.js", "gotAllZones", gotAllZones);

		$scope.form = {};
		$scope.zones = {};

		function gotAllZones(swarm) {
			$scope.zones = swarm.zones;
			$scope.$apply();
		}

		if (form['formId']) {
			for (var prop in form) {
				$scope.form[prop] = form[prop];
			}
		}

		function switchView() {
			$element.modal('hide');
			close($scope.form, 500);
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		}

		$scope.closeForm = function () {
			SweetAlert.swal({
					title: "Close form",
					text: "Are you sure you want to close the form page?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#5cb85c",
					confirmButtonText: "Close it!",
					cancelButtonText: "Go back!",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						switchView();
					}
				});
		};

		$scope.submitForm = function () {
			SweetAlert.swal({
					title: "Review the form",
					text: "Do you want to review the form before saving it?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#5cb85c",
					confirmButtonText: "No, save it!",
					cancelButtonText: "Yes, go back!",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						if ($scope.form.structure.fields.length === 0 || !$scope.form.title || !$scope.form.description || !$scope.form.zone) {
							console.log("nothing to do yet")
						} else {
							if (!formsPermissions.edit || !formsPermissions.add) {
								SweetAlert.swal("Submitting form", "You are not allowed to submit this form.", "warning");
							} else {
								if ($scope.form.is_active === 0 && !formsPermissions.disable) {
									SweetAlert.swal("Form disable", "You are not allowed to disable this form!", "warning");
								} else {
									switchView();
									hub.startSwarm("forms.js", "submitForm", $scope.form);
								}
							}
						}
					}
				});
		};
	}]);