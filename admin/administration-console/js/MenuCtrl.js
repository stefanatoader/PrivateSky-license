function MenuController(hub) {
	$.notifyDefaults(NotifyCfg());

	var menu = [];
	var target = "#app-menu";
	var urlPlaceHolder = "%url%";
	var namePlaceHolder = "%name%";
	var iconPlaceHolder = "%icon%";
	var iframeSelector = "iframe[name='app-content']";

	//template folosit pentru elementele simple ( fara 'copii' ) ale meniului
	var template = "<li>" +
		"<a href=\"" + urlPlaceHolder + "\" target=\"app-content\" class='auto'>" +
		"<i class='"+iconPlaceHolder+"' style='margin-right: 5px;'></i>" +
		"<span class=\"font-bold\">" + namePlaceHolder + "</span>" +
		"</a></li>";

	//template folosit pentru elementele de tip submeniu.
	var nodeTemplate = "<li class='node'>" +
		"<a class='auto nameLabel'>" +
		"<span class=\"pull-right text-muted nameLabel\">\n" +
		"        <i class=\"fa fa-fw fa-angle-right  m-t-sm text\"></i>" +
		"        <i class=\"fa fa-fw fa-angle-down text-active\"></i>" +
		"</span>" +
		"<i class='" + iconPlaceHolder + "' style='margin-right: 5px;'></i>" +
		"<span class=\"font-bold nameLabel\">" + namePlaceHolder + "</span>" +
		"</a></li>";

	hub.on("MenuCtrl.js", "failed", function (swarm) {
		$.notify({
			icon: 'glyphicon glyphicon-warning-sign',
			message: "An error occured while getting menu list!"
		},{
			type: 'danger'
		});
	});

	hub.on("MenuCtrl.js", "gettingListDone", function (swarm) {
		menu = swarm.result;
		gotMenu(menu);
	});

	hub.startSwarm("MenuCtrl.js", "list");

	var displayMenu = function (domParent, menu) {
		if (menu.default) {
			setDefaultApp(menu.url);
		}

		//popularea meniului
		var menuItem = menu.children ? nodeTemplate : template;
		menuItem = Utils.prototype.replaceAll(menuItem, urlPlaceHolder, menu.url);
		menuItem = Utils.prototype.replaceAll(menuItem, namePlaceHolder, menu.name);
		menuItem = Utils.prototype.replaceAll(menuItem, iconPlaceHolder, menu.icon);

		var domMenu = domParent.append(menuItem).children().last();
		//verificarea existentei a 'copiilor'
		if (menu.children) {
			domMenu = domMenu.append("<ul class='nav nav-sub dk'></ul>").children().last();
			for (var i = 0; i < menu.children.length; i++) {
				var childMenu = menu.children[i];
				displayMenu(domMenu, childMenu);
			}
		}
	}

	var gotMenu = function (menu) {

		var domTarget = $(target);
		for (var i = 0; i < menu.length; i++) {
			var menuItem = menu[i];

			displayMenu(domTarget, menuItem);
		}

		insertClickHandlers();
	};

	function insertClickHandlers() {
		$(".node").click(uisrefEmulation);
	}

	function uisrefEmulation(event) {
		//event.preventDefault();
		var target = $(event.currentTarget);
		$(".node.active").each(function (index, item) {
			if (item !== target.get(0)) {
				$(item).removeClass("active");
			}
		});
		if ($(event.target).hasClass("nameLabel")) {
			target.toggleClass("active");
		}
	}

	function setDefaultApp(url){
		var iframe = $(iframeSelector);

		if(iframe.attr("src")==""){
			//we set default app only if there is nothing loaded in the iframe
			iframe.attr("src", url);
		}
	}

	DisplayAvatar(hub);
}


$(document).ready(function () {
	var toggles = $("[data-toggle]");
	var iframes = $("iframe");
	var mainIframe = iframes.get(0);
	var toggleTargets = [];

	toggles.each(function (index, element) {
		var dataTarget = $(element).attr('data-target');
		toggleTargets.push($(dataTarget));
	});

	function toggleOffElements(event) {
		var target = event.target;
		if (toggles.get().indexOf(target) == -1) {
			$(toggles).each(function (index, element) {
				var dataTarget = $(element).attr('data-target');
				switch ($(element).attr('data-toggle')) {
					case "dropdown":
						$(dataTarget).trigger('click.bs.dropdown');
						break;
					case "collapse":
						$(dataTarget).collapse('hide');
						break;
				}
			});
		}
	}

	$('html').click(toggleOffElements);
	$(mainIframe).load(function () {
		var ifr = $(mainIframe).contents();
		ifr.click(toggleOffElements);
	});
});