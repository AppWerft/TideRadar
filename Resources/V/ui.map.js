Ti.Map = require('ti.map');
ui.map = ( function() {
		var api = {};
		api.getMapWindow = function(item) {
			function setPin(datas) {
				var date = new Date().toString('HH:mm');
				if (!datas || !datas.current)
					return;
				var pegel = isNaN(datas.current.level) ? '' : 'Pegel: ' + datas.current.level + ' m';
				var subtitle = date + ' Uhr,  ' + pegel + datas.current.text;
				if (pin)
					pin.subtitle = subtitle;
			}

			var pins = [];
			var pin;
			var status = {
				"zoomed" : false,
				"monitor" : false,
				"record" : false,
				"cron" : null
			};
			var annotation_bussy = false;
			var optionsDialogOpts = {
				options : ['Eigene Position', 'Abbruch'],
				cancel : 1,
				title : 'Gezeitenkarten Aktionen:'
			};
			var dialog = Ti.UI.createOptionDialog(optionsDialogOpts);
			var metaView = Ti.UI.createView({
				width : '100%',
				height : 60,
				top : -60
			});
			var metaBg = Ti.UI.createImageView({
				image : '/assets/black.png',
				opacity : 0.52,
				height : '100%',
				width : '100%',
			});
			metaView.add(metaBg);
			var speedValue = Ti.UI.createLabel({
				right : 10,
				bottom : 0,
				text : '0',
				color : 'red',
				height : 50,
				font : {
					fontSize : 48,
					color : 'red',
					fontFamily : 'Quartz DB'
				},
				size : {
					textAlign : 'right',
					width : 110,
				}
			});
			var speedText = Ti.UI.createLabel({
				text : 'Geschw. /kn:',
				right : 0,
				top : 2,
				color : 'white',
				height : 12,
				width : 'auto',
				font : {
					fontSize : 11,
					fontFamily : 'Copse'
				}
			});
			var nnValue = Ti.UI.createLabel({
				left : 5,
				bottom : 0,
				height : 50,
				color : 'red',
				font : {
					fontSize : 48,
					color : 'red',
					fontFamily : 'Quartz DB'
				},
				size : {
					width : 140,
					height : 50
				}
			});
			var nnText = Ti.UI.createLabel({
				text : 'Höhe über NN:',
				left : 2,
				top : 2,
				color : 'white',
				font : {
					fontSize : 11,
					fontFamily : 'Copse'
				},
				width : 100,
				height : 12

			});
			metaView.add(nnValue);
			metaView.add(nnText);
			metaView.add(speedValue);
			metaView.add(speedText);

			var mainMapView = Ti.Map.createView({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				userLocation : true,
				mapType : Titanium.Map.HYBRID_TYPE,
				region : {
					latitude : 54.05,
					longitude : 8.5,
					latitudeDelta : 0.5,
					longitudeDelta : 0.5
				},
				opacity : 1,
				top : 0,
				bottom : 0
			});
			var mapNavibar = Ti.UI.createScrollableView({
				bottom : -50,
				height : 50,
				opacity : 0.6,
				width : '100%',
				showPagingControl : false,
				backgroundColor : 'black',
			});
			var leftButton = Ti.UI.createButton({
				left : 5,
				width : 25,
				height : 25,
				backgroundImage : '/assets/icon_arrow_left.png'
			});
			var rightButton = Ti.UI.createButton({
				right : 5,
				width : 25,
				height : 25,
				backgroundImage : '/assets/icon_arrow_right.png'
			});

			leftButton.addEventListener('click', function(e) {
				var index = mapNavibar.currentPage;
				if (index > 0) {
					mapNavibar.scrollToView(index - 1);
				}
			});
			rightButton.addEventListener('click', function(e) {
				var index = mapNavibar.currentPage;
				if (index < views.length) {
					mapNavibar.scrollToView(index + 1);
				}
			});
			mapNavibar.add(leftButton);
			mapNavibar.add(rightButton);
			mapNavibar.addEventListener('longpress', function(e) {
				var detailWindow = ui.tides.getDetail(pins[mapNavibar.currentPage].item);

			});
			var locs = ctrl.stations.getLongitudeList();

			var views = [];
			for (var i = 0; i < locs.length; i++) {
				views.push(Ti.UI.createLabel({
					textAlign : 'center',
					font : {
						fontFamily : 'Copse',
						fontSize : 22
					},
					color : 'white',
					height : 23,
					width : '90%',
					text : locs[i].label
				}));
				pins.push(Ti.Map.createAnnotation({
					latitude : locs[i].gps.split(',')[0],
					longitude : locs[i].gps.split(',')[1],
					image : '/assets/pin.png',
					title : locs[i].label,
					subtitle : 'warte auf Daten …',
					item : locs[i],
					animate : false,
					index : i
				}));
			}
			mapNavibar.views = views;
			mainMapView.addAnnotations(pins);

			mainMapView.addEventListener('click', function(e) {
				if (e.clicksource == 'pin') {
					annotation_bussy = true;
					pin = e.annotation;
					mapNavibar.scrollToView(pin.index, {
						duration : 1000
					});
					mainMapView.animate(Ti.UI.createAnimation({
						height : Ti.UI.FILL
					}));
					mapNavibar.animate(Ti.UI.createAnimation({
						bottom : 0
					}));
					ctrl.tides.getForcast(pin.item.id, setPin);
				} else if (e.clicksource == 'title' || e.clicksource == 'title' == 'subtitle') {
					var detailwindow = ui.tides.getDetail(e.annotation.item);

				}
			});
			mapNavibar.addEventListener('scroll', function(_e) {
				var newannotation = pins[_e.currentPage];
				mainMapView.selectAnnotation(newannotation);
				var region = mainMapView.getRegion();
				mainMapView.setLocation({
					latitude : newannotation.latitude,
					longitude : newannotation.longitude,
					latitudeDelta : region.latitudeDelta > 0.5 ? 0.5 : region.latitudeDelta,
					longitudeDelta : region.longitudeDelta > 0.5 ? 0.5 : region.longitudeDelta,
					animate : true
				});
			});
			mainMapView.addEventListener('dblclick', function(e) {
				var detailWindow = ui.tides.getDetail(e.annotation.item);
				w.tab.open(detailWindow);
			});
			//
			// create controls tab and root window
			//
			var w = Titanium.UI.createWindow({
				title : 'Gezeitenkarte@TideRadar',
				fullscreen : true,
				barColor : blue,
				status : {
					"tracking" : false,
					"zoomed" : false
				},
				rightNavButton : Ti.UI.createButton({
					backgroundImage : '/assets/lupe.png',
					width : 40,
					height : 30
				})
			});

			Ti.Gesture.addEventListener('orientationchange', function(e) {
				if (e.orientation == Ti.UI.PORTRAIT)
					mainMapView.setMapType(Ti.Map.HYBRID_TYPE);
				else
					mainMapView.setMapType(Ti.Map.STANDARD_TYPE);
			});

			w.rightNavButton.addEventListener('click', function() {
				ctrl.stations.getPosition(function(p) {
					mainMapView.setLocation({
						latitude : p.latitude,
						longitude : p.longitude,
						latitudeDelta : 0.04,
						animate : true,
						longitudeDelta : 0.04
					});
					optionsDialogOpts.options[0] = 'Kartenüberblick';
					dialog.setOptions(optionsDialogOpts.options);
					status.zoomed = true;
				});
			});
			w.add(mainMapView);
			w.add(mapNavibar);
			w.add(metaView);
			Ti.App.addEventListener('app:init', function() {

			});
			return w;
		};
		return api;
	}());
