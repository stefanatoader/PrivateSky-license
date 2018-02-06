'use strict';
app.controller('eventsController', ['$scope', 'swarmHubService', 'notifier', 'usersZones', '$state', 'SweetAlert', 'defaultEventModels', 'trimLength',
	function ($scope, swarmHubService, notifier, usersZones, $state, SweetAlert, defaultEventModels, trimLength) {

		var hub = swarmHubService.hub;

		hub.startSwarm("events.js", "retrieveEvents", {});
		hub.startSwarm("events.js", "retrieveStructure");

		hub.on("events.js", "retrieveEventsDone", retrieveEventsDone);
		hub.on("events.js", "retrieveStructureDone", retrieveStructureDone);
		hub.on("events.js", "changeStateDone", changeStateDone);
		hub.on("events.js", "failed", failed);

		$scope.fetching = true;
		$scope.events = [];
		$scope.defaultEventModels = defaultEventModels;
		$scope.eventStructure = {};

		function retrieveEventsDone(swarm) {
			$scope.fetching = false;
			$scope.events = swarm.result;

			if ($scope.events.length > 0) {
				$scope.events.unshift($scope.defaultEventModels[1]);
			} else {
				$scope.events.unshift($scope.defaultEventModels[0]);
			}

			$scope.$apply();
		}

		function retrieveStructureDone(swarm) {
			$scope.eventStructure = swarm.result;
			$scope.$apply();
		}

		function failed(swarm) {
			$scope.fetching = true;
			notifier.error(swarm.error);
			$scope.$apply();
		}

		$scope.filterEvents = function (state) {
			if(state==='5'){
				hub.startSwarm('events.js', 'retrieveEvents',{});
			}else{
				hub.startSwarm('events.js', 'retrieveEvents',{state:state});
			}
		};

		$scope.previewEvent = function (event) {
			$state.go('app.preview', {event: JSON.stringify(event)});
		};

		$scope.editEvent = function (event) {
			$state.go('app.edit', {event: JSON.stringify(event), structure: JSON.stringify($scope.eventStructure)});
		};

		$scope.addEvent = function () {
			$state.go('app.edit', {event: JSON.stringify({}), structure: JSON.stringify($scope.eventStructure)});
		};

		$scope.changeState = function (event) {
			var title, text, state;
			if (event.state === "0" || event.state === "1") {
				title = "Publish meeting";
				text = "Are you sure you want to publish the meeting?";
				state = "2";
			} else if (event.state === "3") {
				title = "Publish meeting";
				text = "Are you sure you want to publish the meeting?";
				state = "1"
			} else if (event.state === "2") {
				title = "Unpublish meeting";
				text = "Are you sure you want to unpublish the meeting?";
				state = "0";
			}
			SweetAlert.swal({
					title: title,
					text: text,
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
						event.state = state;
						hub.startSwarm("events.js", "changeState", event);
					}
				});
		};

		function changeStateDone(swarm) {
			$scope.events.some(function (event) {
				if (event.eventId === swarm.event.eventId) {
					for (var field in swarm.event.eventId) {
						event[field] = swarm.event[field];
					}
					return true;
				}
				return false;
			});
		}

		$scope.descriptionTrim = function (event) {
			var description;
			var patt = /\<.*?\>/g;

			if (event && event.description) {
				description = event['description'].replace(patt, "");
				description = description.substring(0, trimLength);
			}
			if (description && event.description.length > trimLength) {
				description += "...";
			}
			return description;
		};

	}]);