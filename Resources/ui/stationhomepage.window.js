const LATTENHEIGHT = 366;
exports.create = function(item) {
	var self = require('ui/window').create({
		title : item.label,
		backgroundColor : 'white'
	});
	setTimeout(function() {
		Ti.Map = require('ti.map');
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
		self.scheduler = Ti.UI.createTableView({
			top : 0,
			bottom : 200
		});
		self.scheduler.addEventListener('scroll', function() {
			hand.hide();
		});
		/*self.webview = Ti.UI.createWebView({
		 url : '/html/index.html',
		 height : 200,
		 zIndex:9999,
		 disableBounce : true,
		 scalesPageToFit : true,
		 bottom : 0
		 });*/
		self.tideview = Ti.UI.createScrollView({
			horizontalWrap : false,
			layout : 'horizontal',
			bottom : 0,
			height : 200,
			scrollType : 'horizontal',
			backgroundColor : 'white'
		});
		self.tideview.add(Ti.UI.createImageView({
			top : 0,
			image : Ti.App.TideRadar.getJS4Chart(item.id),
			width : 1000,
			height : 200,
			borderColor : 'red',
			borderWidth : 1
		}));
		var latte = Ti.UI.createView({
			backgroundImage : '/assets/leerlatte.png',
			width : 28,
			height : LATTENHEIGHT,
			right : 0,
			top : 0,
			borderWidth : 1,
			borderColor : 'gray',
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
		self.add(self.scheduler);
		self.add(latte);
		self.add(hand);
		self.add(self.tideview);
		Ti.App.TideRadar.setFav(item.id);
		Ti.App.TideRadar.getPrediction(item.id, {
			onOk : function(tides) {
				if (tides == null) {
					alert('Für diesen Messpunkt liegen für das Jahr 2014 leider keine Angaben vor. ');
					return;
				}

				/*for (var i=0;i<values.length;i++) {
				 self.tideview.add(Ti.UI.createLabel({
				 backgroundColor:Ti.App.CONF.darkblue,
				 width:1,
				 bottom:0,
				 height:values[i]*36
				 }));
				 }*/

				/*self.webview.addEventListener('load',function() {
				 console.log(tides.current.level);
				 if (!isNaN(tides.current.level)) {
				 console.log('Info: start welle');
				 var js = Ti.App.TideRadar.getJS4Chart(item.id);
				 console.log(js);
				 self.webview.evalJS(js);
				 }
				 });
				 */
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

				var sections = [], headerviews = [];
				if (tides == null) {
					alert('Keine Tidedaten vorhanden – offline?');

				}
				for (var s = 0; s < tides.predictions.length && s < 5; s++) {
					headerviews[s] = Ti.UI.createView({
						height : 30,
						backgroundColor : Ti.App.CONF.darkblue
					});
					headerviews[s].add(Ti.UI.createLabel({
						text : tides.predictions[s].label,
						textAlign : 'left',
						left : 10,
						color : 'white'
					}));
					sections[s] = Ti.UI.createTableViewSection({
						headerView : headerviews[s]
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

				}
				if (!isNaN(tides.current.level)) {

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
		function setSubtitle() {
			activity.actionBar.setSubtitle((Ti.App.TideRadar.getModus() == 'skn') ? 'Seekartennull' : 'Normalnull');
		}

		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.actionBar.setTitle(item.label);
		Ti.App.addEventListener('app:modus_changed', setSubtitle);
		setSubtitle();
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

