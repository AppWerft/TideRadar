exports.create = function(loc,i) {
	return require('ti.map').createAnnotation({
		latitude : loc.gps.split(',')[0],
		longitude : loc.gps.split(',')[1],
		image : '/assets/pin.png',
		title : loc.label,
		subtitle : 'warte auf Daten …',
		item : loc,
		animate : false,
		index : i
	});
};
