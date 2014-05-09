exports.create = function() {
	var bg = (!Ti.Android && Ti.Platform.displayCaps.platformHeight > 480) ? '/assets/Default-568h@2x.png' : '/assets/Default.png';
	var self = Ti.UI.createWindow({
		backgroundImage : bg,
		navBarHidden : true,
		fullscreen : true
	});
	setTimeout(function() {
		self.spinner = Ti.UI.createView({
			backgroundColor : Ti.App.CONF.blue,
			width : '90%',
			height : 80,
			padding : 10,
			bottom : 60,
			borderRadius : 8,
			borderColor : 'gray',
			borderWidth : 1
		});
		self.spinner.add(Ti.UI.createLabel({
			color : 'white',right:20,textAlign:'left',left:10,
			font : {
				fontFamily : Ti.App.CONF.hausschrift,
				fontSize : '16dp'
			},
			text : 'Hole Daten vom Bundesamt\nfür Seeschifffahrt und Hydrographie',
		}));
		self.spinner.add(Ti.UI.createImageView({
			image : '/assets/bshlogo.png',
			right : 10,
			height : 60,
			width : 30
		}));
		self.add(self.spinner);
	}, 10);
	return self;
};
