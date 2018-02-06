'use strict';
app.controller('notificationsController', ['$scope','ModalService','swarmHubService',
    function ($scope,ModalService,swarmHubService) {

        var hub = swarmHubService.hub;

	    hub.startSwarm("zones.js","getAllZones");

        hub.on("notification.js","notificationSent", notificationSent);
	    hub.on("notification.js","failed",failed);
	    hub.on("zones.js","gotAllZones",gotAllZones);

        $scope.notification = {};
        $scope.notificationWasSent = false;
        $scope.errorOccured = false;
        $scope.fetching = true;


	    function notificationSent(swarm){
		    $scope.notificationWasSent = true;
		    $scope.notification = {};
		    $scope.$apply();
	    }

	    function failed(swarm) {
		    $scope.errorOccured = true;
		    $scope.fetching = true;
		    console.log("Error "+swarm.err+" occured");
		    $scope.$apply();
	    }

	    function gotAllZones(swarm) {
		    $scope.zones = swarm.zones;
		    $scope.fetching = false;
		    $scope.$apply();
	    }

        $scope.sendNotification = function(){
            if($scope.notification.actionType !==undefined){
                $scope.notification.action = $scope.notification.actionType;
                if($scope.notification.actionArgument !==undefined){
                    $scope.notification.action+=" with argument: "+$scope.notification.actionArgument
                }
            }
            $scope.notificationWasSent = false;
            $scope.errorOccured = false;

            ModalService.showModal({
                templateUrl: "tpl/modals/previewNotification.html",
                controller: "previewNotificationController",
                inputs:{
                    "notification":$scope.notification
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(notification) {
                    hub.startSwarm("notification.js","sendNotification",notification);
                });
            });
        };
    }]);

app.controller('previewNotificationController', ['$scope',"notification","$element",'close', function($scope,notification,$element, close) {
    var template={
        "title":"Title: ",
        "zone":"Receiver: ",
        "type":"Type of notification: ",
        "category":"Category: ",
        "description":"Description: ",
        "action":"Action to take: "
    };

    $scope.notification = notification;

    $scope.previewNotification = {};
    for(var field in template){
        $scope.previewNotification[field] = template[field]+notification[field];
    }

    $scope.send = function(){
        $scope.notification.expirationDate = new Date($scope.notification.expirationDate);
        $element.modal('hide');
        close($scope.notification,500);
    }
}]);
