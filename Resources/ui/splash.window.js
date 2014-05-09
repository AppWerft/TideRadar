exports.create = function() {
	var bg = (!Ti.Android && Ti.Platform.displayCaps.platformHeight > 480) ? '/assets/Default-568h@2x.png' : '/assets/Default.png';
	console.log(bg);
	var self = Ti.UI.createWindow({
		backgroundImage : bg,
		navBarHidden : true,
		fullscreen : true
	});
	self.spinner = Ti.UI.createActivityIndicator({
		style : Ti.Android ? Ti.UI.ActivityIndicatorStyle.PLAIN : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		message : 'Hole Daten vom Bundesamt für Seeschifffahrt und Hydrographie',
		backgroundColor : 'white',
		width : '200',
		height : '120dp',
		color : 'black',
		padding : 10,
		opacity : 0.8,
		bottom : 120,
		borderRadius : 8,
		borderColor : 'gray',
		borderWidth : 1,
		animation : true,
		font : {
			fontFamily : Ti.App.CONF.hausschrift,
			fontSize : 11
		},
		animated : true
	});
	self.spinner.add(Ti.UI.createImageView({
		image : '/assets/bshlogo.png',
		right : 0,height:120,
		width : 60
	}));
	self.spinner.show();
	self.add(self.spinner);
	setTimeout(function() {
		self.spinner.animate(Ti.UI.createAnimation({
			right : -300,
			duration : 700
		}));
	}, 2000);
	return self;
};
