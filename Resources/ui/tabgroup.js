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
		icon : Ti.Android ? null : 'assets/location.png',
		title : 'Meine Umgebung',
		window : require('ui/distlist.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/list.png',
		title : 'Alle Meßstationen',
		window : require('ui/abclist.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/weather.png',
		title : 'Regenradar',
		window : require('ui/rainradar.window').create()
	}), Titanium.UI.createTab({
		icon : Ti.Android ? null : 'assets/weather.png',
		title : 'Windkarte',
		window : require('ui/wind.window').create()
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
	for (var i = 0; i < tabs.length; i++) {
		self.addTab(tabs[i]);
	}
	if (Ti.Android) {
		self.addEventListener("setTitles", function(_titles) {
			try {
				var actionbar = self.getActivity().getActionBar();
				_titles.title && actionbar.setTitle(_titles.title);
				_titles.subtitle && actionbar.setSubtitle(_titles.subtitle);
			} catch(E) {
			}
		});
		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				activity.actionBar.setTitle('TideRadar');
				activity.actionBar.setSubtitle('warte auf Daten vom Bundesamt …');
				activity.onCreateOptionsMenu = function(e) {
					var modus = Ti.App.TideRadar.getModus();
					var clearAllChecked = function() {
						var items = e.menu.getItems(), item;
						while ( item = items.pop()) {
							item.setChecked(false);
						}
					};
					e.menu.add({
						title : "Seekartennull",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 0,
						checked : (modus == 'skn') ? true : false,
						checkable : true,
						visible : true
					}).addEventListener("click", function() {
						clearAllChecked();
						e.menu.getItem(0).checked = true;
						Ti.App.TideRadar.setModus('skn');
					});
					e.menu.add({
						title : "Normalnull",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 1,
						checked : (modus == 'nn') ? true : false,
						checkable : true,
						visible : true
					}).addEventListener("click", function() {
						clearAllChecked();
						e.menu.getItem(1).checked = true;
						Ti.App.TideRadar.setModus('nn');
					});
				};

			}

		});
	}
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
