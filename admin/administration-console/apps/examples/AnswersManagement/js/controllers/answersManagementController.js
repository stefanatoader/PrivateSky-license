'use strict';
app.controller('answersManagementController', ['$scope','swarmHubService', "notifier", "ModalService",
    function ($scope,swarmHubService,notifier, ModalService) {

        var hub = swarmHubService.hub;

	    hub.startSwarm("forms.js","getAllForms");

        $scope.userEmail = undefined;
        $scope.formTitle = undefined;
        $scope.forms = [];
        $scope.autocomplete = [];
	    $scope.form = {};
	    $scope.answers = [];
        $scope.fetching = true;
        $scope.displayAnswers; // a bool that will control what table will be displayed;
	    $scope.humanReadableDate = humanReadableDate;

        /*$scope.retrieveAnswers = function(){

        	if($scope.userEmail){
		        hub.startSwarm("forms.js","retrieveForms",{"email":$scope.userEmail});
		        $scope.displayAnswers = false;
	        }
	        if($scope.formTitle){
        		hub.startSwarm("forms.js","retrieveAnswersForm",$scope.formTitle);
        		$scope.displayAnswers = true;
	        }
	        console.log($scope.displayAnswers);
        };*/

        hub.startSwarm("forms.js", "retrieveAnswerActivity", {});

	    hub.on("forms.js", "failed", failed);
	    hub.on("forms.js","gotForms", gotForms);
	    hub.on("forms.js","gotAnswers",gotAnswers);
	    hub.on("forms.js","getAllFormsDone",getAllFormsDone);
	    hub.on("forms.js","gotAnswersWusersDone",gotAnswersWusersDone);

	    //SWARN RESPONSES
	    function failed(swarm){
		    $scope.fetching = true;
		    notifier.error("Error on fetching forms.");
	    }

	    function gotForms(swarm){
		    $scope.forms = swarm.forms;
		    $scope.$apply();

		    hub.startSwarm("forms.js","retrieveAnswers",{"email":$scope.userEmail});
	    }

	    function retrieveForms(){
	    	hub.startSwarm("forms.js","getAllForms");
	    }

	    function getAllFormsDone(swarm){
	    	for(var i=0; i<swarm.forms.length;i++){
	    		$scope.autocomplete.push(swarm.forms[i].title);
		    }
		    $scope.$apply();
	    }

        function gotAnswers(swarm) {
	        swarm.answers.forEach(function(answer){
		        $scope.forms.forEach(function (form) {
			        if(form.formId === answer.formId){
				        form.data = answer.answer;
			        }
		        })
	        });
	        $scope.fetching=false;
	        $scope.$apply();
        }

        function gotAnswersWusersDone(swarm) {
	    	console.log("AICIII");
	    	console.log(swarm);
	        $scope.answers = swarm.answers;
	        $scope.fetching = false;
	        $scope.$apply();
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
			    modal.close.then(function (formData) {})
		    })
	    }

    }]);

function humanReadableDate(item) {
	var dateObject = new Date(parseInt(item['date']));
	return jQuery.format.date(dateObject, "dd/MM/yyyy HH:mm:ss");

}

//================[ FORM NEWS CONTROLLER ]================
app.controller('modalFormController', ['$scope', 'form', '$element', 'close', 'notifier', 'swarmHubService',
	function ($scope, form, $element, close, notifier, swarmHubService) {
		var hub = swarmHubService.hub;

		$scope.form = {};
		$scope.lungime = 0;


		if (form['formId']) {
			for (var prop in form) {
				$scope.form[prop] = form[prop];
			}
			if($scope.form.data){
				$scope.lungime = Object.keys($scope.form.data).length;
			}
		}


		$scope.closeForm = function(){
			$element.modal('hide');
			close($scope.form, 500);
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		};
	}]);


