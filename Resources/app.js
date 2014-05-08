var ctrl = {};
var ui = {};
var view = {};
var blue = '#479CFD';
Ti.Map = require('ti.map');
Ti.App.Tides = new (require('controls/bsh.adapter'))();

Ti.App.Tides.loadStations(null, {
	onload : function() {
		tabGroup.open({
			transition : Ti.Android ? null : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
			duration : 600,
		});
		//starter.close();
	},
	onerror : function() {
		tabGroup.open({
			transition : Ti.Android ? null : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
			duration : 600,
		});
		//starter.close();
	}
});

Ti.include('C/date.js');
Ti.include('C/ctrl.tides.js');
Ti.include('C/cachedimage.js');
Ti.include('C/ctrl.stations.js');
Ti.include('V/ui.tidedetail.js');
Ti.include('V/ui.abclist.js');
Ti.include('V/ui.distlist.js');
Ti.include('V/ui.favs.js');
Ti.include('V/ui.weather.js');


var bg = (!Ti.Android  && Ti.Platform.displayCaps.platformHeight > 480) ? '/assets/Default-568h@2x.png' : '/assets/Default.png';
console.log(bg);
Ti.UI.backgroundImage = bg;

var starter = Ti.UI.createWindow({
	backgroundImage : bg,
});

starter.open();

var actInd = Ti.UI.createActivityIndicator({
	style : Ti.Android ? Ti.UI.ActivityIndicatorStyle.PLAIN : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	message : 'Hole Daten vom Bundesamt …',
	backgroundColor : blue,
	width : '200',
	height : '40',
	color : 'black',
	padding : 10,
	opacity : 0.8,
	bottom : 20,
	borderRadius : 8,
	borderColor : 'gray',
	borderWidth : 1,
	animation : true,
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 11
	},
	animated : true
});
starter.add(actInd);
actInd.show();

var tabGroup = Ti.UI.createTabGroup({
	fullscreen : true,
	exitOnClose : true
});

var tab1 = Ti.UI.createTab({
	icon : Ti.Android ? null : '/assets/map.png',
	title : 'Karte',
	window : require('ui/map.window').create(ctrl)
});



var tab2 = Titanium.UI.createTab({
	icon : Ti.Android ? null : 'assets/list.png',
	title : 'ABC',
	window : ui.loclist.getAlfaListWindow()
});

var tab3 = Titanium.UI.createTab({
	icon : Ti.Android ? null : 'assets/location.png',
	title : 'Umgebung',
	window : ui.dist.getDistWindow()
});
var tab4 = Ti.UI.createTab({
	icon : Ti.Android ? null : 'assets/cloud.png',
	title : 'Wetterkarten',
	window : require('ui/weathermaps.window').create()
});

var tab5 = Titanium.UI.createTab({
	icon : Ti.Android ? null : 'assets/star.png',
	title : 'Favoriten',
	visible : false,
	window : ui.favs.getFavListe()
});
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.addTab(tab4);
/*
var favstotal = ctrl.stations.getFavsCount();

if (Ti.Android)
	tabGroup.addTab(tab5);
else {
	Ti.App.addEventListener('favadd', function(e) {
		tab5.setBadge(e.favs.neu);
		if (tabGroup.tabs.length < 4) {
			tabGroup.addTab(tab5);
		}
	});
	if (favstotal > 0) {
		tabGroup.addTab(tab5);
		tab5.setBadge(favstotal);
	}
}*/
setTimeout(function() {
	actInd.animate(Ti.UI.createAnimation({
		right : -300,
		duration : 700
	}));
}, 2000);
