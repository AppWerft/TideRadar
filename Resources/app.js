Ti.App.CONF = {
	blue : '#013B69',
	hausschrift : 'Cops'
};

Ti.App.TideRadar = new (require('controls/bsh.adapter'))();
Ti.App.Moment = require('vendor/moment');

var splashwindow = require('ui/splash.window').create();
splashwindow.open();
Ti.App.TideRadar.loadStations(null, {
	onload : function(_e) {
		if (_e.ok) {
			tabgroup.open({
				transition : Ti.Android ? null : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
				duration : 600,
			});
			splashwindow.close();
		}
	}
});
/*
 Ti.include('C/date.js');
 Ti.include('C/ctrl.tides.js');
 Ti.include('C/cachedimage.js');
 Ti.include('C/ctrl.stations.js');
 Ti.include('V/ui.tidedetail.js');
 Ti.include('V/ui.abclist.js');
 Ti.include('V/ui.distlist.js');
 Ti.include('V/ui.favs.js');
 Ti.include('V/ui.weather.js');
 */

var tabgroup = require('ui/tabgroup').create();

