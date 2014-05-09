var w = Ti.Platform.displayCaps.platformWidth;

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
			height : w / 4,
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
	if (Ti.Network.online) {
		console.log(Ti.Platform.displayCaps.platformWidth);
		console.log(Ti.Platform.displayCaps.logicalDensityFactor);
		var scale = Ti.Platform.displayCaps.logicalDensityFactor * w / 540;
		console.log('SCALE' + scale);
		var transform = Ti.UI.create2DMatrix().scale(scale).translate(w - 540, w - 500);
		var radarview = Ti.UI.createWebView({
			top : 0,
			backgroundColor : 'gray',
			left : 0,
			disableBounce : true,
			scalesPageToFit : false,
			//touchEnabled : false,
			//transform : transform,
			url : 'http://familientagebuch.de/tideradar/images/radar.gif'
		});
		//radarview.add(Ti.UI.createView());
		radarview.addEventListener('longpress', function(_e) {
			radarview.reload();
		});
		self.add(radarview);
	}
	self.container = Ti.UI.createTableView({
		backgroundColor : '#333',
		top : 0

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
	//self.add(self.container);
	self.container.addEventListener('click', function(_e) {
		self.tab.open(require('ui/webmaps.window').create(_e.rowData.itemId, _e.rowData.itemLabel));
	});
	return self;
};
