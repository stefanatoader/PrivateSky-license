'use strict';

app.controller('newsManagerController', ['$scope', 'ModalService', 'swarmHubService', '$timeout','dateFormat','notifyDefaults', function ($scope, ModalService, swarmHubService, $timeout, dateFormat,notifyDefaults) {
	$.notifyDefaults(notifyDefaults);

	var hub = swarmHubService.hub;
	$scope.newsToDisplay;
	$scope.fetching = true;

	hub.on("Notifications.js", "notificationSent", function(swarm){
		$.notify({
			icon: 'glyphicon glyphicon-info-sign',
			message: "Notification sent!"
		},{
			type: 'info'
		});
	});

	hub.on("Notifications.js", "notificationFailed", function(swarm){
		$.notify({
			icon: 'glyphicon glyphicon-info-sign',
			message: "Notification sending process failed"
		},{
			type: 'info'
		});
	});

	//=========[ SEND & GET NEWS LIST ]=========
	hub.on("NewsSwarm.js", "getNewsListDone", populateNews);

	hub.on("NewsSwarm.js", "newsCreationDone", function (swarm) {
		$scope.newsToDisplay.push(swarm.result);
		$scope.$apply();
		$.notify({
			icon: 'glyphicon glyphicon-ok',
			message: "Item added successfully!"
		}, {
			type: 'success'
		});
	});

	hub.on("NewsSwarm.js", "newsUpdateDone", function (swarm) {
		$scope.stripHTMLTagsBody(swarm.result);

		$scope.newsToDisplay.some(function (item) {
			if (item.newsId === swarm.result.newsId) {
				for (var field in swarm.result.userId) {
					item[field] = swarm.result[field];
				}
				$.notify({
					icon: 'glyphicon glyphicon-ok',
					message: "Item updated successfully!"
				}, {
					type: 'success'
				});
				return true;
			}
			return false;
		});

	});


	hub.startSwarm("NewsSwarm.js", "newsList");

	//================[ NEWS FORM FUNCTIONS ]================
	//Functie folosita pentru deschiderea ferestrei modale
	$scope.newsForm = function (news, state) {
		ModalService.showModal({
			templateUrl: "tpl/newsForm.html",
			controller: "newsFormController",
			inputs: {
				"news": news,
				"edit": state
			}
		}).then(function (modal) {
			modal.element.modal();
			modal.close.then(function (newsData) {
				if (newsData['newsId']) {
					for (var prop in newsData) {
						news[prop] = newsData[prop];
					}
					hub.startSwarm("NewsSwarm.js", "update", news);
				} else {
					hub.startSwarm("NewsSwarm.js", "create", newsData);
				}
			});
		});
	};

	//================[ SEARCH & FILTER FUNCTIONS ]================
	$scope.startFilter = function () {
		$('.footable').trigger('footable_filter', {
			filter: $('#filter').val()
		});
	};

	hub.on("NewsSwarm.js", "failed", function (swarm) {
		$.notify({
			icon: 'glyphicon glyphicon-warning-sign',
			message: "An error occured!"
		},{
			type: 'danger'
		});
	});


	//===========[ HELPER FUNCTIONS ]===========
	function populateNews(swarm) {
		$scope.newsToDisplay = swarm.result;
		$scope.fetching = false;
		$scope.$apply();
	}

	$scope.stripHTMLTagsBody = htmlStrip;

	$scope.humanReadableDate = humanReadableDate;
	$scope.notifyNews = getNotificationHandler(hub);
	$scope.format = dateFormat;
}]);

function humanReadableDate(item, format){
	var dateObject = new Date(parseInt(item['date']));
	return jQuery.format.date(dateObject, format)
}

function getNotificationHandler(hub){
	return function notifyNewsAll(news) {
		var url = "url";
		var filter = undefined;
		hub.startSwarm("Notifications.js", "sendNotification", filter, news.title, htmlStrip(news, 30), url);
	};
}

function htmlStrip (item, trimLength) {
	var patt=/\<.*?\>/g;
	var text = item['body'].replace(patt, "");
	var trimmed = text.substring(0, trimLength);

	if (text.length > trimLength) {
		return trimmed + "...";
	}
	return trimmed;
}

//================[ FORM NEWS CONTROLLER ]================
app.controller('newsFormController', ['$scope', 'news', 'edit', '$element', 'close','dateFormat','swarmHubService', function ($scope, news, edit, $element, close, dateFormat, swarmHubService) {
	$scope.news = {};
	$scope.edit = edit;
	$scope.notifyNews = getNotificationHandler(swarmHubService.hub);

	//Folosita in caz de editare a stirii
	if (news['newsId']) {
		for (var prop in news) {
			$scope.news[prop] = news[prop];
		}
	}

	$scope.toggleEdit = function () {
		$scope.edit = !$scope.edit;
	};

	$scope.publishNews = function () {
		$element.modal('hide');
		close($scope.news, 500);
	};

	$scope.humanReadableDate = humanReadableDate;
	$scope.format = dateFormat;
}]);