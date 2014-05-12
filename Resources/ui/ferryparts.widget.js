exports.create = function(loc) {
	var pin = '/assets/mappins/' + Ti.Platform.displayCaps.density + '-ferry.png';
	console.log(loc.tiroute);return {
		annotation : require('ti.map').createAnnotation({
			latitude : loc.latitude,
			longitude : loc.longitude,title:loc.title,
			image : pin,title:loc.title,
			type : 'ferry'
		}),
		
		route : require('ti.map').createRoute({
			points : loc.tiroute,
			width : 7,
			color : 'orange'
		})
	};
};
