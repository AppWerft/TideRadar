var ctrl = {};
var ui = {};
var view = {};
var blue = '#479CFD';

Ti.App.Tides = new (require('controls/bsh.adapter'))();

Ti.App.Tides.loadStations(null, {
	onload : function() {
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
Ti.include('V/ui.map.js');

Ti.UI.backgroundImage = '/assets/Default.png';
var starter = Ti.UI.createWindow({
	backgroundImage : '/assets/Default.png',
	width : '100%',
	height : '100%',

});
starter.open();
var actInd = Titanium.UI.createActivityIndicator({
	style : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	message : 'Initialisierung …',
	backgroundColor : '#D4A017',
	width : '200',
	height : '40',
	color : 'black',
	padding : 10,
	opacity : 0.87,
	bottom : 20,
	borderRadius : 8,
	borderColor : 'black',
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

var tabGroup = Titanium.UI.createTabGroup({
});

var tab1 = Titanium.UI.createTab({
	icon : 'assets/map.png',
	title : 'Karte',
	window : ui.map.getMapWindow()
});

tabGroup.addTab(tab1);

setTimeout(function() {
	tabGroup.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
		duration : 100,
	});
	//	starter.close();
}, 2000);

var tab2 = Titanium.UI.createTab({
	icon : 'assets/list.png',
	title : 'ABC',
	window : ui.loclist.getAlfaListWindow()
});

var tab3 = Titanium.UI.createTab({
	icon : 'assets/location.png',
	title : 'Umgebung',
	window : ui.dist.getDistWindow()
});
var tab4 = Titanium.UI.createTab({
	icon : 'assets/star.png',
	title : 'Favoriten',
	visible : false,
	window : ui.favs.getFavListe()
});

tabGroup.addTab(tab2);
tabGroup.addTab(tab3);

var favstotal = ctrl.stations.getFavsCount();

Ti.App.getEventListener('favadd', function(e) {
	tab4.setBadge(e.favs.neu);
	if (tabGroup.tabs.length < 4) {
		tabGroup.addTab(tab5);
	}
});
if (favstotal > 0) {
	tabGroup.addTab(tab4);
	tab4.setBadge(favstotal);
}

setTimeout(function() {
	actInd.animate(Ti.UI.createAnimation({
		right : -300,
		duration : 700
	}));
}, 1500);
