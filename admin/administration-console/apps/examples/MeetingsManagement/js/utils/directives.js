app.directive('bgImg', function () {
	return function (scope, element, attrs) {
		var url = attrs.bgImg;
		element.css({
			'background':'url('+url+') center center',
			'background-size':'cover'
		})
	};
});