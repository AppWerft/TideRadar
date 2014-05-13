exports.create = function(item) {
	var self = require('ui/window').create({
		title : item.label
	});
	setTimeout(function() {
		Ti.Map = require('ti.map');
		var cron = null;
		var pin = null;
		var hasLevel = false;
		var rightButton = Ti.UI.createImageView({
			width : 32,
			height : 32,
			borderWidth : 1,
			borderRadius : 6
		});
		rightButton.addEventListener('click', function(e) {
			if (rightButton.weather) {
				//tabGroup.activeTab.open(ui.detail.getWeatherWindow(rightButton.weather));
			}
		});

		/*ctrl.stations.getWeather(item.gps, function(e) {
		 var hours = e[0].hourly;
		 var now = new Date();
		 var index = Math.floor(now.getHours() / 3);
		 rightButton.setImage(hours[index].weatherIconUrl[0].value);
		 ctrl.cachedImageView('cache', hours[index].weatherIconUrl[0].value, rightButton, true);
		 rightButton.weather = hours;
		 });*/
		/*self.leftNavButton.addEventListener('click', function() {
		 self.close();
		 });*/
		self.scheduler = Ti.UI.createTableView({
			top : 0,
			height : '50%'
		});
		self.scheduler.addEventListener('scroll', function() {
			hand.hide();
		});
		/*var webview = Ti.UI.createWebView({
		 url : '/html/index.html',
		 opacity : 0.9,
		 height : 120,
		 bottom : -200,
		 borderRadius : 8
		 });
		 webview.addEventListener('dblclick', function() {
		 webview.animate(Ti.UI.createAnimation({
		 bottom : -200,
		 duration : 600
		 }));
		 });*/
		var bg = Ti.UI.createImageView({
			opacity : 0.3,
			image : 'assets/bg.png',
			width : Ti.UI.FILL,
			height : 287,
			left : 0,
			bottom : -300,
			touchEnabled : false,
		});
		var latte = Ti.UI.createView({
			backgroundImage : '/assets/leerlatte.png',
			width : 28,
			height : 366,
			right : 0,
			top : 0,
			borderWidth : 1,
			borderColor : 'gray',
			borderRadius : 3,
			touchEnabled : true,
		});

		var hand = Ti.UI.createImageView({
			image : '/assets/hand.png',
			width : 40,
			right : 30,
			height : 23,
			bottom : -23,
			opacity : 0.75
		});

		self.mapview = Ti.Map.createView({
			height : Ti.UI.FILL,
			userLocation : true,
			userLocationButton : false,
			enableZoomControls : false,
			mapType : Titanium.Map.HYBRID_TYPE,
			region : {
				latitude : parseFloat(item.gps.split(',')[0], 10) + 0.015,
				longitude : item.gps.split(',')[1],
				latitudeDelta : 1,
				longitudeDelta : 1
			},
			top : '50%'
		});
		pin = Ti.Map.createAnnotation({
			latitude : item.gps.split(',')[0],
			longitude : item.gps.split(',')[1],
			title : item.label,
			image : '/assets/mappins/' + Ti.Platform.displayCaps.density + '-pin.png',
			subtitle : 'keine Pegelinformationen',
			animate : true,
		});
		self.mapview.addAnnotation(pin);

		self.mapview.selectAnnotation(pin);
		self.add(self.mapview);

		self.add(self.scheduler);

		self.add(latte);
		self.add(hand);

		self.scheduler.add(bg);

		//self.add(webview);
		Ti.App.TideRadar.setFav(item.id);
		Ti.App.TideRadar.getPrediction(item.id, {
			onOk : function(tides) {
				if (tides == null) {
					alert('Für diesen Messpunkt liegen für das Jahr 2014 leider keine Angaben vor. ');
					return;
				}
				function setLatte(latte, level) {
					var lattenpositionen = [0, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14];
					for (var i = 0; i < lattenpositionen.length; i++) {
						var slot = lattenpositionen[i];
						var text = Math.round((parseFloat(level, 10) * 100 - slot * 10 + 47) / 10);
						var color = text > 0 ? 'black' : 'red';
						text = Math.abs(text);
						if (text < 10)
							text = '0' + text;
						var options = {
							color : color,
							font : {
								fontSize : '16dp',
								fontFamily : 'SteelfishRg-Bold'
							},
							height : '20dp',
							top : 5 + 24.5 * slot + 'dp',
							text : text,
						};
						if (slot % 2) {
							options.left = '3dp';
						} else {
							options.left = '16dp';
						}
						latte.add(Ti.UI.createLabel(options));
					}
					latte.animate(Ti.UI.createAnimation({
						right : 0
					}));
					hand.animate(Ti.UI.createAnimation({
						top : '110dp',
						right : '5dp',
						duration : 3000
					}));
				}

				function setPin() {
					var date = new Date().toString('HH:mm');
					var level = (tides.current.level) ? ' Pegel: ' + tides.current.level + ' m' : '';
					var subtitle = date + ' Uhr, ' + level + tides.current.text;
					if (pin)
						pin.subtitle = subtitle;
				}

				/*
				 if (!isNaN(datas.current.level)) {
				 scheduler.addEventListener('click', function() {
				 ctrl.tides.getCurveData(item.id, function(js) {
				 webview.evalJS(js);
				 webview.animate(Ti.UI.createAnimation({
				 bottom : 0,
				 duration : 400
				 }));
				 });

				 });
				 }*/
				var sections = [];
				if (tides == null) {
					alert('Keine Tidedaten vorhanden – offline?');

				}
				for (var s = 0; s < tides.predictions.length; s++) {
					sections[s] = Ti.UI.createTableViewSection({
						headerTitle : tides.predictions[s].label
					});
					var rows = [];
					for (var i = 0; i < tides.predictions[s].tides.length; i++) {
						var event = tides.predictions[s].tides[i];
						var color = event["in_past"] ? '#bbb' : 'black';
						var daylabel = Ti.UI.createLabel({
							text : event['i18n'] + ' Uhr',
							left : 10,
							color : color,
							top : 5,
							height : 20,
							font : {
								fontFamily : 'Copse'
							}
						});
						var typelabel = Ti.UI.createLabel({
							text : (event.direction == 'HW') ? 'Hochwasser' : 'Niedrigwasser',
							left : 10,
							color : color,
							font : {
								fontFamily : 'Copse'
							},
							bottom : 5,
							height : 20
						});
						var levellabel = Ti.UI.createLabel({
							text : event.level,
							color : color,
							font : {
								fontWeight : 'bold',
								fontSize : 28,
								fontFamily : 'Copse'

							},
							height : 30,
							width : '100%',
							textAlign : 'right',
							right : 40,
							bottom : 10
						});
						var row = Ti.UI.createTableViewRow({
							height : '50dp',
							backgroundColor : 'white'
						});
						row.add(daylabel);
						row.add(levellabel);
						row.add(typelabel);
						sections[s].add(row);
					}
					self.scheduler.setData(sections);
					bg.animate(Ti.UI.createAnimation({
						duration : 2800,
						top : '50dp'
					}));

				}
				if (!isNaN(tides.current.level)) {
					var phi = (tides.current.direction == '+') ? -10 : 10;
					cron = setTimeout(function() {
						setLatte(latte, tides.current.level);
						hand.transform = Ti.UI.create2DMatrix().rotate(phi);
					}, 2000);
				} else {
					latte.hide();
				}
			}
		});
		self.addEventListener('close', function(e) {
			console.log('Info: detailwindow closed');
		});
	}, 100);
	Ti.Android && self.addEventListener('open', function() {
		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.actionBar.setTitle(item.label);
		activity.actionBar.setSubtitle('Seekartennull');
		activity.onCreateOptionsMenu = function(e) {
			e.menu.add({
				title : 'Wetter',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				icon : Ti.App.Android.R.drawable.ic_action_weather
			}).addEventListener("click", function() {
				require('ui/weather.window').create(item.id, item.label).open();
			});

		};
	});
	return self;
};

