'use strict';
app.controller('previewController', ['$scope', 'swarmHubService', 'notifier', 'usersZones', '$stateParams', '$state', 'SweetAlert',
	function ($scope, swarmHubService, notifier, usersZones, $stateParams, $state, SweetAlert) {


		$scope.fetching = false;
		$scope.event = JSON.parse($stateParams.event);
		$scope.eventStructure = {};
		$scope.user;
		$scope.interests;
		$scope.attendees;
		$scope.comments;
		$scope.commentMessage = '';

		var hub = swarmHubService.hub;

		hub.startSwarm('UserManagement.js', 'filterUsers', {userId: $scope.event.userId});
		hub.startSwarm('events.js', 'attendeesCount', {eventId: $scope.event.eventId});
		hub.startSwarm('events.js', 'interestedCount', {eventId: $scope.event.eventId});
		hub.startSwarm("events.js", "retrieveStructure");
		hub.startSwarm("events.js", "comments",$scope.event.eventId);

		hub.on("UserManagement.js", "failed", failed);
		hub.on('UserManagement.js', 'gotFilteredUsers', gotFilteredUsers);
		hub.on("events.js", "failed", failed);
		hub.on('events.js', 'getAttendeesCountDone', getAttendeesCountDone);
		hub.on('events.js', 'getInterestedCountDone', getInterestedCountDone);
		hub.on("events.js", "retrieveStructureDone", retrieveStructureDone);
		hub.on("events.js", "getEventsDone", getEventsDone);
		hub.on("events.js", "submitCommentDone", submitCommentDone);


		$scope.gotoGrid = function () {
			$state.go('app.events', {}, {reload: true});
		};

		$scope.gotoEdit = function (event) {
			// console.log(event);
			$state.go('app.edit', {event: JSON.stringify($scope.event), structure: JSON.stringify($scope.eventStructure)});
		};

		$scope.capitalize = function (input) {
			return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
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

		$scope.submitComment = function () {
			if ($scope.commentMessage != '') {
				var commentObject = {
					eventId: $scope.event.eventId,
					message: $scope.commentMessage
				};

				hub.startSwarm('events.js', 'submitComments', {commentObject: commentObject});
			} else {
				notifier.error("Your comment must not be empty.");
			}
		};

		function failed(swarm) {
			notifier.error(swarm.error);
			$scope.$apply();
		}

		function submitCommentDone(swarm) {
			console.log("submitCommentDone>",swarm);
		}

		function retrieveStructureDone(swarm) {
			$scope.eventStructure = swarm.result;
			$scope.$apply();
		}

		function gotFilteredUsers(swarm) {
			//fix this
			delete swarm.result[0].__meta;
			delete swarm.result[0].password;
			delete swarm.result[0].salt;

			$scope.user = swarm.result[0];
			console.log($scope.user);
			$scope.$apply();
		}

		function getAttendeesCountDone(swarm) {
			$scope.attendees = swarm.result;
			$scope.$apply();
		}

		function getInterestedCountDone(swarm) {
			$scope.interests = swarm.result;
			$scope.$apply();
		}

		function getEventsDone(swarm) {
			$scope.comments = swarm.result;
			$scope.$apply();
		}
	}]);