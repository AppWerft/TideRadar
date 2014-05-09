Ti.App.CONF = {
	blue : '#013B69',
	hausschrift : 'Cops'
};
Ti.App.Moment = require('vendor/moment');
Ti.App.Moment.lang('de');

Ti.App.TideRadar = new (require('controls/bsh.adapter'))();


var splashwindow = require('ui/splash.window').create();
splashwindow.open();

var tabgroup = require('ui/tabgroup').create();
Ti.App.TideRadar.loadStations(null, function(_e) {
	if (_e.ok) {
		tabgroup.open({
			transition : Ti.Android ? null : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
			duration : 600,
		});
		splashwindow.close();
		tabgroup.fireEvent('setTitles', {
			title : 'TideRadar',
			subtitle : _e.total + ' Messwerte bis ' + _e.latest
		});
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

