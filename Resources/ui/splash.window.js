exports.create = function() {
	var bg = (!Ti.Android && Ti.Platform.displayCaps.platformHeight > 480) ? '/assets/Default-568h@2x.png' : '/assets/Default.png';
	var self = Ti.UI.createWindow({
		backgroundImage : bg,
		navBarHidden : true,
		exitOnClose : true,
		fullscreen : true
	});
	setTimeout(function() {
		popuplayer = Ti.UI.createView({
			backgroundColor : Ti.App.CONF.blue,
			width : '90%',
			opacity : 0.8,
			height : 80,
			padding : 10,
			bottom : 60,
			borderRadius : 8,
			borderColor : 'gray',
			borderWidth : 1
		});
		popuplayer.add(Ti.UI.createLabel({
			color : 'white',
			right : 20,
			textAlign : 'left',
			left : 10,
			font : {
				fontFamily : Ti.App.CONF.hausschrift,
				fontSize : '14dp'
			},
			text : 'Hole Daten vom Bundesamt\nfür Seeschifffahrt und Hydrographie',
		}));
		var progressview = Ti.UI.createProgressBar({
			bottom : 0,
			height : 'auto',
			min : 0,
			zIndex : 999,
			right : 80,
			left : 10,
			max : 1,
			value : 0.01
		});
		progressview.show();
		self.setProgress = function(_p) {
			progressview.setValue(_p);
		};
		popuplayer.add(Ti.UI.createImageView({
			image : '/assets/bshlogo.png',
			right : 10,
			height : 60,
			width : 30
		}));
		popuplayer.add(progressview);
		self.add(popuplayer);
	}, 10);
	return self;
};
