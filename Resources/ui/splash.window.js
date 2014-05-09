exports.create = function() {
	var bg = (!Ti.Android && Ti.Platform.displayCaps.platformHeight > 480) ? '/assets/Default-568h@2x.png' : '/assets/Default.png';
	console.log(bg);
	var self = Ti.UI.createWindow({
		backgroundImage : bg,
		navBarHidden : true,
		fullscreen : true
	});
	self.spinner = Ti.UI.createActivityIndicator({
		style : Ti.Android ? Ti.UI.ActivityIndicatorStyle.BIG : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		message : 'Hole Daten vom Bundesamt\nfür Seeschifffahrt und Hydrographie',
		backgroundColor : Ti.App.CONF.blue,
		width : '90%',
		height : '120dp',
		color : 'white',
		padding : 10,
		opacity : 0.8,
		bottom : 60,
		borderRadius : 8,
		borderColor : 'gray',
		borderWidth : 1,
		font : {
			fontFamily : Ti.App.CONF.hausschrift,
			fontSize : '12dp'
		}
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
