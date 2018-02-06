app.filter('userMappingZones', ['usersZones',function (usersZones) {
	var zones = {};
	for (var i = 0 ; i < usersZones.length; i++){
		zones[usersZones[i].name] = usersZones[i].nice;
	}

	return function (x) {
		return zones[x];
	}
}]);

app.filter('capitalize', function(input) {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});