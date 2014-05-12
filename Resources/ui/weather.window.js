exports.create = function(_id,_title) {
	var weatherforcasts = Ti.App.TideRadar.getWeather(_id);
	var self = require('ui/window').create({
		title:'Marinewetter',
		subtitle:_title
		}
	);
	self.tableview = Ti.UI.createTableView({
		borderWidth : 1,
		borderColor : Ti.App.CONF.blue,
		backgroundImage : '/assets/bg/1.png'
	}); setTimeout(function() {
	var sections = [];
	var values = {
				"cloudcover" : 'proz. Wolkenbedeckung|%',
				"humidity" : 'rel. Luftfeuchtigkeit|%',
				"precipMM" : 'Niederschlag|mm',
				"pressure" : "Luftdruck|mbar",
				"swellDir" : "Wellenrichtung|°",
				"swellHeight_m" : "Wellenhöhe|m",
				"swellPeriod_secs" : "Wellenperiode|sec.",
				"tempC" : "Lufttemperatur|°C",
				"visibility" : "Sicht|",
				"waterTemp_C" : "Wassertemperatur|°C",
				"winddir16Point" : "Windrichtung|",
				"windspeedKmph" : "Windgeschwindigkeit|km/h"
	};
	for(var h = 0; h < weatherforcasts.length; h++) {
	var title;
	var rows = [];
	
	if(weatherforcasts[h].time < 100)
	title = '0:00 Uhr';
	else if(weatherforcasts[h].time < 1000)
	title = weatherforcasts[h].time.substr(0, 1) + ':00 Uhr';
	else if(weatherforcasts[h].time < 10000)
	title = weatherforcasts[h].time.substr(0, 2) + ':00 Uhr';
	var headerView = Ti.UI.createView({
		height : 45,
		backgroundColor : 'silver',
		backgroundImage : '/assets/shadow.png'
	});
	var headerLabel = Ti.UI.createLabel({
		text : title,
		right : 5,
		color : 'white',
		height : 22,
		bottom:3,
		width:'100%',
		textAlign:'right',
			font : {
				fontFamily : Ti.App.CONF.hausschrift,
				fontSize : '20dp'
			}
		});
		var headerIcons = [];
		for (var i=0; i<8; i++) {
			headerIcons[i] = Ti.UI.createImageView({
				height : (h==i) ? 40 : 20,
				width : (h==i) ? 40 : 20,
				left : (i>h) ? i*25+20 : i*25,
				top :2,
				borderRadius : 5,
				borderWidth : 1,
				borderColor : 'gray',
				opacity: (h==i) ? 1 : 0.7,
				image : weatherforcasts[i].weatherIconUrl[0].value
			});
			headerView.add(headerIcons[i]);
		}
		var windIcon = Ti.UI.createImageView({
			height : 30,
			width : 30,
			right : 100,
			image : 'http://www.worldweatheronline.com/images/wind/' + weatherforcasts[h].winddir16Point + '.png'
		});
		headerView.add(headerLabel);
//			headerView.add(windIcon);


		var section = Ti.UI.createTableViewSection({
			headerView : headerView
		});
		var rows = [];
		for (var key in values) {
					var row = Ti.UI.createTableViewRow({
						height : 40,backgroundColor:'white'
					});
					var label = Ti.UI.createLabel({
						left : 10,
						height : 26,
						text : values[key].split('|')[0],
						font : {
							fontSize : 22,
							fontFamily : 'Copse',
							fontWeight : 'bold'
						}
					});
					var value = Ti.UI.createLabel({
						right : 10,
						height : 18,
						width: '100%',
						textAlign:'right',
						text : weatherforcasts[h][key] + ' ' + values[key].split('|')[1],
						font : {
							fontSize : 16,
							fontFamily : 'Copse'
						}
					});
					row.add(label);
					row.add(value);
					section.add(row);
				}
				sections.push(section);
			}
			self.tableview.setData(sections);
			var now = new Date();
			var slot = Math.floor(now.getHours() / 3);
			self.tableview.scrollToIndex(12 * slot, {
					animated : true
			});},100);
		self.add(self.tableview);
		return self;
};
