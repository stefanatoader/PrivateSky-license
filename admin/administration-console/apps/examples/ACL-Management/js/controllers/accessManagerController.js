'use strict';
app.controller('accessManagerController', ['$scope', 'ModalService', 'swarmHubService', 'SweetAlert', 'swarmPredefinedValues', 'swarmLabels', 'sweetAlertConfiguration',
	function ($scope, ModalService, swarmHubService, SweetAlert, swarmPredefinedValues, swarmLabels, sweetAlertConfiguration) {
		var swarmHub = swarmHubService.hub;

		swarmHub.startSwarm("acl.js", "getAllRules", {});
		swarmHub.startSwarm("zones.js", "getAllZones");

		swarmHub.on("zones.js", "gotAllZones", gotAllZones);
		swarmHub.on("acl.js", "gotRules", gotRules);
		swarmHub.on("acl.js", "ruleAdded", ruleAdded);
		swarmHub.on("acl.js", "ruleRemoved", ruleRemoved);
		swarmHub.on("acl.js", "ruleUpdated", ruleUpdated);
		swarmHub.on("acl.js", "failed", failed);

		$scope.searchFilter = {};
		$scope.rules = [];
		$scope.zones = [];
		$scope.fetching = false;

		$scope.performSearch = function () {
			$('.footable').trigger('footable_filter', {
				filter: $('#filter').val()
			});
		};

		$scope.editRule = editRule;
		$scope.removeRule = removeRule;

		$scope.createRule = function () {
			createRule("white_list", {}, {});
		};
		$scope.addException = function () {
			createRule("black_list", {}, {});
		};
		$scope.createSwarmRule = function () {
			createRule("white_list", swarmPredefinedValues, swarmLabels);
		};
		$scope.addSwarmException = function () {
			createRule("black_list", swarmPredefinedValues, swarmLabels);
		};


		function gotAllZones(swarm) {
			$scope.zones = swarm.zones;
			$scope.zones.push('NO_USER');
			$scope.$apply();
		}

		function gotRules(swarm) {
			$scope.rules = swarm.result;
			$scope.performSearch();
			$scope.$apply();
		}

		function ruleAdded(swarm) {
			$scope.rules.unshift(swarm.result);
			$scope.performSearch();
			$scope.$apply();
		}

		function ruleRemoved(swarm) {
			$scope.rules = $scope.rules.filter(function (rule) {
				return rule.id !== swarm.rule.id;

			});
			$scope.performSearch();
			$scope.$apply();
		}

		function ruleUpdated(swarm) {
			$scope.rules = $scope.rules.map(function (rule) {
				if (rule.id === swarm.rule.id) {
					return swarm.rule;
				}
				return rule;
			});
			$scope.performSearch();
			$scope.$apply();
		}

		function failed(swarm) {
			console.log("Error " + swarm.err + " occured");
		}


		function createRule(type, predefinedInputs, specificLabels) {
			ModalService.showModal({
				templateUrl: "tpl/modals/createRule.html",
				controller: "createRuleController",
				inputs: {
					"type": type,
					"predefinedInputs": predefinedInputs,
					"specificLabels": specificLabels,
					'zones': $scope.zones
				}
			}).then(function (modal) {
				modal.element.modal();
				modal.close.then(function (rule) {
					swarmHub.startSwarm("acl.js", "add", rule);
				});
			});
		}

		function editRule(rule) {
			ModalService.showModal({
				templateUrl: "tpl/modals/editRule.html",
				controller: "editRuleController",
				inputs: {
					"rule": rule,
					'zones': $scope.zones
				}
			}).then(function (modal) {
				modal.element.modal();
				modal.close.then(function (rule) {
					swarmHub.startSwarm("acl.js", "update", rule);
				});
			});
		}

		function removeRule(rule) {
			SweetAlert.swal(sweetAlertConfiguration, function (isConfirm) {
				if (isConfirm) {
					swarmHub.startSwarm("acl.js", "remove", rule);
				}
			});
		}

	}]);

var model = [
	{
		name: "action",
		type: "text",
		nice: "Action",
		placeholder: "Type of action",
		error: [{
			type: "required",
			message: "Action field is required."
		}]
	},
	{
		name: "contextType",
		type: "text",
		nice: "Context type",
		placeholder: "Context type",
		error: [{
			type: "required",
			message: "Context type is required."
		}]
	},
	{
		name: "context",
		type: "text",
		nice: "Context",
		placeholder: "Context",
		error: [{
			type: "required",
			message: "Context field is required."
		}]
	},
	{
		name: "subcontextType",
		type: "text",
		nice: "Subcontext type",
		placeholder: "Subcontext type",
		error: [{
			type: "required",
			message: "Subcontext type is required."
		}]
	},
	{
		name: "subcontext",
		type: "text",
		nice: "Subcontext",
		placeholder: "subcontext",
		error: [{
			type: "required",
			message: "Subcontext is required."
		}]
	}
];


app.controller('createRuleController', ['$scope', 'type', 'predefinedInputs', 'zones', 'specificLabels', "$element", 'close', 'createRuleLabels',
	function ($scope, type, predefinedInputs, zones, specificLabels, $element, close,createRuleLabels) {
		$scope.props = model;
		$scope.rule = {};
		$scope.type = type;
		$scope.zones = zones;

		$scope.predefinedInputs = predefinedInputs;
		$scope.labels = createRuleLabels;
		$scope.labels.createMessage = ($scope.type === "white_list") ? "Create rule" : "Add exception";
		$scope.labels.welcomeMessage = ($scope.type === "white_list") ? "Create new rule" : "Add new exception";

		for (var prop in predefinedInputs) {
			$scope.rule[prop] = predefinedInputs[prop];
		}

		for (var label in $scope.labels) {
			if (specificLabels[label]) {
				$scope.labels[label] = specificLabels[label];
			}
		}

		$scope.rule.type = type;
		$scope.createRule = function () {
			$element.modal('hide');
			close($scope.rule, 500);
		}
	}]);

app.controller('editRuleController', ['$scope', 'rule', 'zones', '$element', 'close',
	function ($scope, rule, zones, $element, close) {
		$scope.props = model;
		$scope.rule = {};
		$scope.zones = zones;
		$scope.createMessage = "Update";
		$scope.welcomeMessage = (rule.type === "white_list") ? "Update rule" : "Update exception";

		for (var prop in rule) {
			$scope.rule[prop] = rule[prop];
		}

		$scope.updateRule = function () {
			$element.modal('hide');
			close($scope.rule, 500);
		}
	}]);