app.filter('userMappingZones', ['usersZones',function (usersZones) {
	var zones = {};
	for (var i = 0 ; i < usersZones.length; i++){
		zones[usersZones[i].name] = usersZones[i].nice;
	}

	return function (x) {
		return zones[x];
	}
}]);