exports.create = function() {
	function fillListe(locs) {
		var rows = [];
		liste.setData(rows);
		for (var i = 0; i < locs.length && i < 16; i++) {
			liste.appendRow(require('ui/distlist.row').create(locs[i]));
		}
		//liste.setData(rows);
	}

	var self = Ti.UI.createWindow({
		barColor : Ti.App.CONF.blue,
		fullscreen : true,
		title : 'Umgebung@TideRadar'
	});
	var liste = Ti.UI.createTableView({
		top : (Ti.Android) ? 0 : 15
	});

	if (!Ti.Android) {
		var hint = Ti.UI.createLabel({
			height : 15,
			backgroundColor : 'red',
			top : 0,
			color : 'white',
			left : 0,
			font : {
				fontSize : 10
			},
			text : '  Ziehen erfrischt die Werte und speichert offline'
		});
		self.add(hint);
		var tableHeader = Ti.UI.createView({
			backgroundImage : "/assets/bunthaus2.jpg",
			width : Ti.Platform.displayCaps.platformWidth - 1,
			height : 140
		});
		var arrow = Ti.UI.createView({
			backgroundImage : "./assets/whiteArroself.png",
			width : 23,
			height : 60,
			bottom : 10,
			left : 20
		});
		var statusLabel = Ti.UI.createLabel({
			text : "Ziehe um zu  aktualisieren",
			left : 55,
			width : 200,
			bottom : 10,
			height : "auto",
			color : "silver",
			textAlign : "center",
			font : {
				fontSize : 13,
				fontWeight : "bold"
			},
			shadowColor : "#999",
			shadowOffset : {
				x : 0,
				y : 1
			}
		});
		var lastUpdatedLabel = Ti.UI.createLabel({
			text : "",
			left : 55,
			width : 220,
			bottom : 15,
			height : "auto",
			color : "#576c89",
			textAlign : "center",
			font : {
				fontSize : 12
			},
			shadowColor : "#999",
			shadowOffset : {
				x : 0,
				y : 1
			}
		});
		var actInd = Titanium.UI.createActivityIndicator({
			left : 20,
			bottom : 13,
			width : 30,
			height : 30
		});
		tableHeader.add(arrow);
		tableHeader.add(statusLabel);
		//	tableHeader.add(lastUpdatedLabel);
		tableHeader.add(actInd);
		liste.headerPullView = tableHeader;
		var pulling = false;
		var reloading = false;
		var self = this;
		function beginReloading() {
			setTimeout(endReloading, 1000);
		}
		function endReloading() {
			Ti.App.TideRadar.getDistList(fillListe);
			reloading = false;
			lastUpdatedLabel.text = "";
			statusLabel.text = "Ziehe runter!";
			actInd.hide();
			arroself.show();
			liste.setContentInsets({
				top : 0
			}, {
				animated : true
			});
		}


		liste.addEventListener('scroll', function(e) {
			liste.setTop(0);

			var offset = e.contentOffset.y;
			var t;
			if (offset <= -65.0 && !pulling) {
				t = Ti.UI.create2DMatrix();
				t = t.rotate(-180);
				pulling = true;
				arroself.animate({
					transform : t,
					duration : 180
				});
				statusLabel.text = "Lass' los!";
			} else if (pulling && offset > -65.0 && offset < 0) {
				pulling = false;
				t = Ti.UI.create2DMatrix();
				arroself.animate({
					transform : t,
					duration : 180
				});
				statusLabel.text = "Zieh runter!";
			}
		});
		liste.addEventListener('scrollEnd', function(e) {
			if (pulling && !reloading && e.contentOffset.y <= -65.0) {
				reloading = true;
				pulling = false;
				arroself.hide();
				actInd.show();
				statusLabel.text = "Aktualisiere Tidedaten …";
				liste.setContentInsets({
					top : 60
				}, {
					animated : true
				});
				arroself.transform = Ti.UI.create2DMatrix();
				beginReloading();
			}
		});
	}
	liste.addEventListener('click', function(e) {
		var win = require('ui/stationhomepage.window').create(e.row.item);
		(Ti.Android) ? win.open(): self.tab.open(win);
	});
	self.addEventListener('focus', function() {
		Ti.App.TideRadar.getDistList(fillListe);
	});
	self.add(liste);
	return self;
};

