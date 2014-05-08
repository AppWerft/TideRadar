var w = Ti.Platform.displayCaps.platformWidth ;

exports.create = function() {
	function getMap(key, label) {
		var self = Ti.UI.createTableViewRow({
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			hasChild : true,
			itemId : key,
			itemLabel : label
		});
		self.add(Ti.UI.createImageView({
			width : w,
			height : w / 6,
			image : '/assets/maps/' + key + '.png'
		}));
		self.add(Ti.UI.createLabel({
			text : label,
			bottom : 5,
			right : 5,
			color : 'white',
			font : {
				fontSize : 20,
				fontFamily : 'Copses'
			}
		}));
		return self;
	}

	var self = Ti.UI.createWindow({
		barColor : '#479CFD',
		title : 'Wetterkarten'
	});
	var radarview = Ti.UI.createWebView({
		top : 0,
		left : 0,
		width : w,
		height : 0.9 * w,
		disableBounce : true,
		scalesPageToFit : true,
		url : 'http://familientagebuch.de/tideradar/images/radar.gif'
	});
	radarview.addEventListener('longpress', function(_e) {
		radarview.reload();
	});
	var comment = Ti.UI.createWebView({
		url : 'radarview://gds32025:cEtPCZbY@radarview-outgoing2.dwd.de/gds/specials/forecasts/text/VHDL30_DWHH_060800_COR'
	});
	radarview.addEventListener('load', function(_e) {
		console.log('radarview');
		console.log(radarview.getData());
	});
	console.log('Start radarview ');
	self.add(comment);
	comment.addEventListener('load', function(_e) {
		console.log('comment');
		console.log(comment.getData());
	});
	self.add(radarview);
	self.container = Ti.UI.createTableView({
		backgroundColor : '#333',
		top : 298

	});
	var maps = {
		"wind" : "Windstärke",
		"temp" : "Lufttemperatur",
		"precipitation" : "Regendichte",
		"clouds" : "Wolkenbedeckung",
		"clouds_cls" : "Wolken als Kontur",
		"pressure_cntr" : "Luftdruck als Kontur"
	};
	for (var key in maps) {
		self.container.appendRow(getMap(key, maps[key]));
	}
	self.add(self.container);
	self.container.addEventListener('click', function(_e) {
		self.tab.open(require('ui/webmaps.window').create(_e.rowData.itemId, _e.rowData.itemLabel));
	});
	return self;
};
