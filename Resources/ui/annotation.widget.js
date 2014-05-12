exports.create = function(loc,i) {
	var pin = '/assets/mappins/' + Ti.Platform.displayCaps.density + '-pin.png';
	return require('ti.map').createAnnotation({
		latitude : loc.gps.split(',')[0],
		longitude : loc.gps.split(',')[1],
		image : pin,
		title : loc.label,
		subtitle : 'Pegeldaten unbekannt',
		itemId : loc.id,
		type: 'station',
		index : i || 1
	});
};
