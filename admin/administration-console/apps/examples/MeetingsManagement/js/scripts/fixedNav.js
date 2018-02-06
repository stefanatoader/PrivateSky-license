$(document).ready(function(){

	var nav = $('#navBar');
	var sidebar = $("#sidebarSection");
	var content = $(".app-content-body");
	var sidebarHeading = $("#sidebarHeading");
	sidebarHeading.hide();

	content.scroll(function () {
		if (content.scrollTop() > 171) {
			nav.addClass("fixedNav");
			sidebar.addClass("fixedSidebar");
			sidebarHeading.show();
		} else {
			nav.removeClass("fixedNav");
			sidebar.removeClass("fixedSidebar");
			sidebarHeading.hide();
		}
	});

	var scrollSpeed = 1000;
	var currentOffset = 0;

	var descriptionBtn = $("#descriptionBtn");
	var detailsBtn = $("#detailsBtn");
	var commentsBTN = $("#commentsBtn");
	var attendeesBtn = $("#attendeesBtn");
	var contactBtn = $("#contactBtn");

	var descriptionSection = $("#descriptionSection");
	var detailsSection = $("#detailsSection");
	var commentsSection = $("#commentsSection");
	var attendeesSection = $("#attendeesSection");
	var contactSection = $("#contactSection");

	//init stuff
	descriptionBtn.addClass("active");
	var lastBTN = descriptionBtn;
	var lastSection = descriptionSection;

	descriptionBtn.click(function () {
		lastBTN.removeClass('active');
		lastBTN = descriptionBtn;
		lastBTN.addClass('active');

		content.scrollTo(descriptionSection, scrollSpeed);

		// content.animate({scrollTop:descriptionSection.offset().top},scrollSpeed);
	});

	detailsBtn.click(function () {
		lastBTN.removeClass('active');
		lastBTN = detailsBtn;
		lastBTN.addClass('active');

		content.scrollTo(detailsSection, scrollSpeed);


		// debugger;
		// content.animate({scrollTop:descriptionSection.offset().top},0);
		// content.animate({scrollTop:detailsSection.offset().top},scrollSpeed);
	});

	commentsBTN.click(function () {
		lastBTN.removeClass('active');
		lastBTN = commentsBTN;
		lastBTN.addClass('active');

		content.scrollTo(commentsSection, scrollSpeed);


		// debugger;
		// content.animate({scrollTop:descriptionSection.offset().top},0);
		// content.animate({scrollTop:commentsSection.offset().top},scrollSpeed);
	});

	attendeesBtn.click(function () {
		lastBTN.removeClass('active');
		lastBTN = attendeesBtn;
		lastBTN.addClass('active');

		content.scrollTo(attendeesSection, scrollSpeed);


		// content.animate({scrollTop:descriptionSection.offset().top},0);
		// content.animate({scrollTop:attendeesSection.offset().top},scrollSpeed);
	});

	contactBtn.click(function () {
		lastBTN.removeClass('active');
		lastBTN = contactBtn;
		lastBTN.addClass('active');


		content.scrollTo(contactSection, scrollSpeed);

		// content.animate({scrollTop:descriptionSection.offset().top},0);
		// content.animate({scrollTop:contactSection.offset().top},scrollSpeed);
	});

});
