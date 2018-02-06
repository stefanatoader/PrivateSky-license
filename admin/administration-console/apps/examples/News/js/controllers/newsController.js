'use strict';

app.controller('newsController', ['$scope', 'swarmHubService', '$timeout', 'dateFormat', 'newsPerPage', 'trimLength', 'notifyDefaults', function ($scope, swarmHubService, $timeout, dateFormat, newsPerPage, trimLength, notifyDefaults) {
	$.notifyDefaults(notifyDefaults);

	var hub = swarmHubService.hub;
	$scope.newsToDisplay;
	$scope.fetching = true;
	$scope.format = dateFormat;
	$scope.itemsPerPage = newsPerPage;
	$scope.totalItems = newsPerPage;
	$scope.trimLength = trimLength;

	hub.on("NewsSwarm.js", "getNewsListDone", populateNews);
	hub.startSwarm("NewsSwarm.js", "getByActive", 1);

	hub.on("NewsSwarm.js", "failed", function (swarm) {
		$.notify({
			icon: 'glyphicon glyphicon-warning-sign',
			message: "An error occured!"
		}, {
			type: 'danger'
		});
	});

	function populateNews(swarm) {
		$scope.fetching = false;
		$scope.newsToDisplay = swarm.result.sort(function (a, b) {
			var keyA = new Date(a.date),
				keyB = new Date(b.date);
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});

		$scope.newsToDisplay.forEach(function (item, index) {
			item['expanded'] = false;
		});

		$scope.$apply();
		renderTable();
	}

	function renderTable() {
		$timeout(function () {
			$('#newsTable').trigger('footable_redraw');
		}, 500);
	}

	$scope.switch = function (news) {
		news.expanded = !news.expanded;
	};

	$scope.newsTrim = function (news) {
		var body;
		var patt = /\<.*?\>/g;

		if (news && news.body) {
			body = news['body'].replace(patt, "");
			body = body.substring(0, trimLength);
		}
		if (body) {
			body += "...";
		}
		return body;
	};

	$scope.loadMore = function () {
		$scope.totalItems += $scope.itemsPerPage;
	};

	renderTable();
}]);