'use strict';

app.controller('userManagerController', ['$scope', 'ModalService', 'swarmHubService', '$timeout', 'notifyDefaults','usersZones', function ($scope, ModalService, swarmHubService, $timeout, notifyDefaults,usersZones) {
	$.notifyDefaults(notifyDefaults);

	var hub = swarmHubService.hub;

	//Variabila ce controlleaza afisarea sau nu a utilizatorilor in cadrul aplicatiei
	$scope.fetching = true;
	$scope.usersToDisplay = [];

	//Asteaptarea raspunsului cu utilizatorii filtrati.
	hub.on("UserManagement.js", "gotFilteredUsers", gotResult);

	//Afisarea erorii survenite din cadrul swarm-urilor
	hub.on("UserManagement.js", "failed", function (swarm) {
		$.notify({
			icon: 'glyphicon glyphicon-warning-sign',
			message: "An error occured!"
		}, {
			type: 'danger'
		});
	});

	//Afisarea unui mesaj de success si adaugarea noului utilizator creat la lista utilizatorilor
	hub.on("UserManagement.js", "userCreated", function (swarm) {
		$scope.usersToDisplay.push(swarm.result);
		$scope.$apply();
		$.notify({
			icon: 'glyphicon glyphicon-ok',
			message: "User added successfully!"
		}, {
			type: 'success'
		});
	});

	//Afisarea unui mesaj de success si actualizarea in cadrul listei de utilizatori a utilizatorului proaspat edit.
	hub.on("UserManagement.js", "userEdited", function (swarm) {
		$scope.usersToDisplay.some(function (user) {
			if (user.userId === swarm.result.userId) {
				for (var field in swarm.result.userId) {
					user[field] = swarm.result[field];
				}
				$.notify({
					icon: 'glyphicon glyphicon-ok',
					message: "User updated successfully!"
				}, {
					type: 'success'
				});
				return true;
			}
			return false;
		});
	});

	//Apelul swarm pentru preluarea utilizatorilor si a zonelor de access.
	hub.startSwarm("UserManagement.js", "getUsersWZones");

	//Aceasta functie are rolul de a deschide fereastra de tip modal pentru crearea unui utilizator
	$scope.createUser = function () {
		ModalService.showModal({
			templateUrl: "tpl/modals/createUser.html",
			controller: "createUserController"
		}).then(function (modal) {
			modal.element.modal();
			modal.close.then(function (userData) {
				hub.startSwarm("UserManagement.js", "createUser", userData);
			});
		});
	};

	//Aceasta functie are rolul de a deschide fereastra de tip modal pentru editarea unui utilizator.
	//Obiectul utilizatorului este dat ca parametru functiei.
	$scope.editUser = function (user) {
		ModalService.showModal({
			templateUrl: "tpl/modals/editUser.html",
			controller: "editUserController",
			inputs: {
				"user": user
			}
		}).then(function (modal) {
			modal.element.modal();
			modal.close.then(function (userData) {
				hub.startSwarm("UserManagement.js", "editUser", userData);
				for (var prop in userData) {
					user[prop] = userData[prop];
				}
			});
		});
	};

	//Filtrarea utilizatorilor pentru intermediul unei functii de filtrare a librariei footable.
	$scope.startFilter = function () {
		$('.footable').trigger('footable_filter', {
			filter: $('#filter').val()
		});
	};

	//Functia de preluarea a listei de utilizatori de la swarm-uri.
	function gotResult(swarm) {
		$scope.fetching = false;
		$scope.usersToDisplay = swarm.result;
		$scope.$apply();
	}


}]);

// Obiectul - model folosit in cadrul ferestrei modal pentru randarea formularului.
var model = [
	{
		name: "firstName",
		type: "text",
		nice: "Firstname",
		placeholder: "John",
		error: [{
			type: "required",
			message: "First name is required."
		}]
	},
	{
		name: "lastName",
		type: "text",
		nice: "Lastname",
		placeholder: "Doe",
		error: [{
			type: "required",
			message: "Last name is required."
		}]
	},
	{
		name: "email",
		type: "email",
		nice: "Email",
		placeholder: "john.doe@example.com",
		error: [{
			type: "required",
			message: "Email is required."
		}, {
			type: "email",
			message: "Field input is not valid. Please type an email address."
		}]
	},
	{
		name: "username",
		type: "text",
		nice: "Username",
		placeholder: "john.doe",
		error: [{
			type: "required",
			message: "Username is required."
		}]
	},
	{
		name: "avatar",
		type: "url",
		nice: "Avatar",
		placeholder: "Your avatar url",
		error: [{
			type: "required",
			message: "Avatar url is required."
		},{
			type: "url",
			message: "Avatar must be an url format."
		}]
	},
	{
		name: "password",
		type: "password",
		nice: "Password",
		placeholder: "Password",
		error: [{
			type: "required",
			message: "Password is required."
		}]
	}
];

//Controller-ul corespunzator modalului de creare a unui utilizator.
app.controller('createUserController', ['$scope', "$element", 'close', 'usersZones', function ($scope, $element, close, usersZones) {
	$scope.user = {"status": "Active"};
	$scope.createUser = function () {
		$element.modal('hide');
		close($scope.user, 500);
	};
	$scope.model = model;
	$scope.usersZones = usersZones;
}]);

//Controller-ul corespunzator modalului de editare a unui utilizator.
app.controller('editUserController', ['$scope', 'user', '$element', 'close', 'usersZones', function ($scope, user, $element, close, usersZones) {
	$scope.user = {};
	for (var prop in user) {
		$scope.user[prop] = user[prop];
	}
	$scope.saveUser = function () {
		$element.modal('hide');
		close($scope.user, 500);
	};
	$scope.model = model;
	$scope.usersZones = usersZones;
}]);