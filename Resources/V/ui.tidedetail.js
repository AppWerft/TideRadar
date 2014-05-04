ui.tides = ( function() {
		var api = {};
		api.getDetail = function(item) {
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
					tabGroup.activeTab.open(ui.detail.getWeatherWindow(rightButton.weather));
				}
			});
			var detailwindow = Ti.UI.createWindow({
				title : item.label,
				barColor : blue,
				title : item.label,
				leftNavButton : Ti.UI.createButton({
					systemButton : Ti.UI.iPhone.SystemButton.REPLY
				}),
				rightNavButton : rightButton
			});
			tabGroup.activeTab.open(detailwindow);
			detailwindow.addEventListener('close', function() {
				detailwindow = null;
			});
			ctrl.stations.getWeather(item.gps, function(e) {
				var hours = e[0].hourly;
				var now = new Date();
				var index = Math.floor(now.getHours() / 3);
				rightButton.setImage(hours[index].weatherIconUrl[0].value);
				ctrl.cachedImageView('cache', hours[index].weatherIconUrl[0].value, rightButton, true);
				rightButton.weather = hours;
			});
			detailwindow.leftNavButton.addEventListener('click', function() {
				detailwindow.close();
			});
			var scheduler = Ti.UI.createTableView({
				top : 0,
				height : 240
			});
			scheduler.addEventListener('scroll', function() {
				hand.hide()
			});
			var webview = Ti.UI.createWebView({
				url : '/html/index.html',
				opacity : 0.9,
				width : Ti.UI.FILL,
				height : 120,
				bottom : -200,
				borderRadius : 8
			});
			webview.addEventListener('dblclick', function() {
				webview.animate(Ti.UI.createAnimation({
					bottom : -200,
					duration : 600
				}));
			});
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
				backgroundImage : 'assets/leerlatte.png',
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

			var detailMapView = Ti.Map.createView({
				height : Ti.UI.FILL,
				width : '100%',
				userLocation : true,
				mapType : Titanium.Map.HYBRID_TYPE,
				region : {
					latitude : parseFloat(item.gps.split(',')[0], 10) + 0.015,
					longitude : item.gps.split(',')[1],
					latitudeDelta : 0.04,
					longitudeDelta : 0.04
				},
				top : 220
			});
			pin = Ti.Map.createAnnotation({
				latitude : item.gps.split(',')[0],
				longitude : item.gps.split(',')[1],
				title : item.label,
				image : '/assets/bigpin.png',
				subtitle : 'keine Pegelinformationen',
				animate : true,
			});
			detailMapView.addAnnotation(pin);
			detailMapView.selectAnnotation(pin, true);
			detailwindow.add(scheduler);
			detailwindow.add(detailMapView);
			detailwindow.add(latte);
			detailwindow.add(hand);

			scheduler.add(bg);
			var geduld = Ti.UI.createView({
				width : 260,
				height : 120,
				backgroundColor : '#fff',
				borderWidth : 1,
				borderColor : 'black',
				borderRadius : 8,
				opacity : 0.9,
				top : 70,
				left : 10

			});
			var wartetext = Ti.UI.createLabel({
				text : 'Hole aktuelle Tidedaten für ' + item.label + "\n\nQuelle:Bundesamt für Seeschifffahrt und Hydrographie Hamburg und Rostock",
				left : 5,
				height : '100%',
				font : {
					fontSize : 13,
					fontFamily : 'Copse'
				}
			});
			geduld.add(wartetext);
			geduld.text = wartetext;
			detailwindow.add(geduld);
			geduld.animate(Ti.UI.createAnimation({
				duration : 400,
				opacity : 0.8
			}));
			detailwindow.add(webview);
			ctrl.tides.getForcast(item.id, function(datas) {
				if (datas == null) {
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
								fontWeight : 'bold',
								fontSize : 18,
								fontFamily : 'SteelfishRg-Bold'
							},
							height : 20,
							top : 5 + 24.5 * slot,
							text : text,
						};
						if (slot % 2) {
							options.left = 3;
						} else {
							options.left = 16;
						}
						latte.add(Ti.UI.createLabel(options));
					}
					latte.animate(Ti.UI.createAnimation({
						right : 0
					}));
					hand.animate(Ti.UI.createAnimation({
						top : 110,
						right : 5,
						duration : 3000
					}));
				}

				function setPin() {
					var date = new Date().toString('HH:mm');
					var level = (datas.current.level) ? ' Pegel: ' + datas.current.level + ' m' : '';
					var subtitle = date + ' Uhr, ' + level + datas.current.text;
					if (pin)
						pin.subtitle = subtitle;
				}

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
				}
				var sections = [];
				if (datas == null) {
					alert('Keine Tidedaten vorhanden – offline?');
					geduld.hide();
				}
				for (var s = 0; s < datas.daysets.length; s++) {
					sections[s] = Ti.UI.createTableViewSection({
						headerTitle : datas.daysets[s].day
					});
					var rows = [];
					for (var i = 0; i < datas.daysets[s].events.length; i++) {
						var event = datas.daysets[s].events[i];
						var color = (event.ispast) ? '#aaa' : '#000';
						var daylabel = Ti.UI.createLabel({
							text : event.time + ' Uhr',
							left : 10,
							color : color,
							top : 5,
							height : 20,
							font : {
								fontFamily : 'Copse'
							}
						});
						var typelabel = Ti.UI.createLabel({
							text : (event.type == 'HW') ? 'Hochwasser' : 'Niedrigwasser',
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
							height : 50,
							width : '100%'
						});
						row.add(daylabel);
						row.add(levellabel);
						row.add(typelabel);
						sections[s].add(row);
					}
					scheduler.setData(sections);
					bg.animate(Ti.UI.createAnimation({
						duration : 2800,
						top : 50
					}));
					geduld.hide();
				}
				if (!isNaN(datas.current.level)) {
					var phi = (datas.current.direction == '+') ? -10 : 10;
					cron = setTimeout(function() {
						setLatte(latte, datas.current.level);
						setPin();
						hand.transform = Ti.UI.create2DMatrix().rotate(phi);
					}, 2000);
				} else {
					latte.hide();
				}
				if (tabGroup.tabs.length == 3) {
					tabGroup.addTab(tab4);
				}
			});
			detailwindow.addEventListener('close', function(e) {
				if (cron != null)
					clearInterval(cron);
				//detailMapView.removeAnnotation(pin);
				e.source = null;
			});
			return detailwindow;
		};
		return api;
	}());
