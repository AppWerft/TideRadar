var Ferries = function() {
	var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/models/ferries.json');
	this.ferries = JSON.parse(jsonfile.read());
	for (var i = 0; i < this.ferries.length; i++) {
		var listoflocations = this.ferries[i].route;
		this.ferries[i].tiroute = [];
		var len = listoflocations.length;
		this.ferries[i].latitude = (listoflocations[0][0] + listoflocations[len-1][0]) / 2;
		this.ferries[i].longitude = (listoflocations[0][1] + listoflocations[len-1][1]) / 2;
		for (var p = 0; p < len; p++) {
			this.ferries[i].tiroute.push({
				latitude : listoflocations[p][0],
				longitude : listoflocations[p][1]
			});
		}
	};
	return this;
};
/* Helper function to calculate datas for now: */

isArray = function(obj) {
	return Object.prototype.toString.call(obj) == "[object Array]";
};
var getDistance = function(lat1, lon1, lat2, lon2) {
	var R = 6371000;
	// m (change this constant to get miles)
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return Math.round(d);
};

Ferries.prototype = {
	getAll : function() {
		return this.ferries;
	}
};
module.exports = Ferries;
