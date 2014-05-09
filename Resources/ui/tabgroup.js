exports.create = function() {
	var self = Ti.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true
	});
	var tabs = [Ti.UI.createTab({
		icon : Ti.Android ? null : '/assets/map.png',
		title : 'Karte',
		window : require('ui/map.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/list.png',
		title : 'Alle Meßstationen',
		window : require('ui/abclist.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/cloud.png',
		title : 'Regenradarfilm',
		window : require('ui/rainradar.window').create()
	})];
	/*
	 var tab2 =

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
	 });*/
	for (var i=0; i<tabs.length;i++) {
		self.addTab(tabs[i]);
	}
	
	self.addEventListener("open", function() {
		var activity = self.getActivity();
		if (activity && activity.actionBar) {
			activity.actionBar.setTitle('TideRadar');
		}
	});
	/*
	 var favstotal = ctrl.stations.getFavsCount();

	 if (Ti.Android)
	 self.addTab(tab5);
	 else {
	 Ti.App.addEventListener('favadd', function(e) {
	 tab5.setBadge(e.favs.neu);
	 if (self.tabs.length < 4) {
	 self.addTab(tab5);
	 }
	 });
	 if (favstotal > 0) {
	 self.addTab(tab5);
	 tab5.setBadge(favstotal);
	 }
	 }*/
	return self;
};
