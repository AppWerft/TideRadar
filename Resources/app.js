Ti.App.CONF = {
	blue : '#013B69',
	hausschrift : 'Copse'
};
Ti.App.Moment = require('vendor/moment');
Ti.App.Moment.lang('de');

Ti.App.TideRadar = new (require('controls/bsh.adapter'))();
Ti.App.Ferries = new (require('controls/ferries.adapter'))();

var splashwindow = require('ui/splash.window').create();
splashwindow.open();

var tabgroup = require('ui/tabgroup').create();
Ti.App.TideRadar.loadStations(null, {
	onload : function(_e) {
		var status = Ti.App.TideRadar.getStationsStatus();
		if (_e.ok) {
			tabgroup.open({
				transition : Ti.Android ? null : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
				duration : 600,
			});
			splashwindow.close();
			tabgroup.fireEvent('setTitles', {
				title : 'TideRadar',
				subtitle : status.total + ' Messwerte für die nächsten ' + status.days + ' Tage.'
			});
		}
	},
	onprogress : function(_e) {
		splashwindow.setProgress(_e);
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

