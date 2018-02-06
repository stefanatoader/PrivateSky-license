'use strict';
app.controller('formRenderedController', ['$scope', "swarmHubService", "notifier", "ModalService",
	function ($scope, swarmHubService, notifier, ModalService) {

		var hub = swarmHubService.hub;

		hub.startSwarm("forms.js", "retrieveForms",{message:"formRender"});

		hub.on("forms.js", "failed", failed);
		hub.on("forms.js", "gotForms", gotForms);
		hub.on("forms.js", "gotAnswers", gotAnswers);
		hub.on("forms.js", "answerSubmitted", answerSubmitted);

		$scope.fetching = true;
		$scope.form = {};
		$scope.forms = [];
		$scope.humanReadableDate = humanReadableDate;


		//SWARN RESPONSES
		function failed(swarm) {
			$scope.fetching = true;
			notifier.error("Error on fetching forms.");
		}

		function gotForms(swarm) {
			if (swarm.forms) {
				$scope.fetching = false;
				$scope.forms = swarm.forms;
				$scope.$apply();

				hub.startSwarm("forms.js", "retrieveAnswers");
			}
		}

		function gotAnswers(swarm) {
			swarm.answers.forEach(function (answer) {
				$scope.forms.forEach(function (form) {
					if (form.formId === answer.formId) {
						form.data = answer.answer;
					}

					form.answered = !!form.data;

				})
			});
			console.log($scope.forms);
			$scope.$apply();
		}

		function answerSubmitted(swarm) {
			if (swarm.answer) {
				if (swarm.formId) {
					$scope.forms.some(function (item) {
						if (item.formId === swarm.formId) {
							item.data = swarm.answer;
						}
					})
				}
				notifier.success("Form submitted successfully.");
				$scope.$apply();
			}
		}

		//Scope functions
		$scope.modalForm = function (form) {
			ModalService.showModal({
				templateUrl: "tpl/modalForm.html",
				controller: "modalFormController",
				inputs: {
					"form": form
				}
			}).then(function (modal) {
				modal.element.modal();
				modal.close.then(function (formData) {
					console.log(formData);
				})
			})
		}
	}]);

function humanReadableDate(item) {
	var dateObject = new Date(parseInt(item['date']));
	return jQuery.format.date(dateObject, "dd/MM/yyyy HH:mm:ss");

}

//================[ FORM NEWS CONTROLLER ]================
app.controller('modalFormController', ['$scope', 'form', '$element', 'close', 'notifier', 'swarmHubService', 'SweetAlert',
	function ($scope, form, $element, close, notifier, swarmHubService, SweetAlert) {
		var hub = swarmHubService.hub;

		$scope.form = {};
		$scope.lungime = 0;


		if (form['formId']) {
			for (var prop in form) {
				$scope.form[prop] = form[prop];
			}
			if ($scope.form.data) {
				$scope.lungime = Object.keys($scope.form.data).length;
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
					text: "Are you sure you want to close the form?",
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

		$scope.submitForm = function (form) {
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
						switchView();
						hub.startSwarm("forms.js", "submitFormAnswer", form.data, form.formId);
					}
				});
		};

	}]);
