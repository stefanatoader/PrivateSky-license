'use strict';
app.controller('editController', ['$scope', 'swarmHubService', 'notifier', 'usersZones', '$stateParams', '$state', 'SweetAlert', 'trimLength',
	function ($scope, swarmHubService, notifier, usersZones, $stateParams, $state, SweetAlert,trimLength) {

		$scope.event = JSON.parse($stateParams.event);
		$scope.structure = JSON.parse($stateParams.structure);
		$scope.userName;
		$scope.userEmail;

		var hub = swarmHubService.hub;

		hub.startSwarm('UserManagement.js','filterUsers',{userId:$scope.event.userId});

		hub.on("events.js", "failed", failed);
		hub.on('UserManagement.js','failed',failed);
		hub.on("events.js", "submitEventDone", submitEventDone);
		hub.on('UserManagement.js','gotFilteredUsers',gotFilteredUsers);


		$scope.gotoGrid = function () {
			SweetAlert.swal({
					title: "Exit event editor",
					text: "Are you sure you want to exit meeting editor?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#5cb85c",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						$state.go('app.events', {}, {reload: true});
					}
				});
		};

		$scope.submitEvent = function () {
			SweetAlert.swal({
					title: "Review the meeting",
					text: "Do you want to save the changes?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#5cb85c",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						hub.startSwarm("events.js", "submitEvent", $scope.event);
					}
				});
		};

		$scope.descriptionTrim = function (event) {
			var description;
			var patt = /\<.*?\>/g;

			if (event && event.description) {
				description = event['description'].replace(patt, "");
				description= description.substring(0, trimLength);
			}
			if (description && event.description.length>trimLength) {
				description+= "...";
			}
			return description;
		};

		function failed(swarm) {
			notifier.error(swarm.error);
			$scope.$apply();
		}

		function submitEventDone(swarm) {
			if(swarm){
				notifier.success('Meeting saved successfully.');
				$state.go('app.events', {}, {reload: true});
			}
		}

		function gotFilteredUsers(swarm) {
			$scope.userName = swarm.result[0].firstName + ' ' + swarm.result[0].lastName;
			$scope.userEmail = swarm.result[0].email;
			$scope.$apply();
		}

	}]);