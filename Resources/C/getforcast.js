ctrl.tides = ( function() {
	var api = {};
	var dummy = 1;
	api.getForcast = function(id, callback) {
		var url = 'http://www.bsh.de/cgi-bin/gezeiten/was_tab.pl?ort=' + id + '&zone=Gesetzliche+Zeit+%B9&niveau=KN';

		var xhr = Titanium.Network.createHTTPClient({
			timeout : 25000
		});
		xhr.onload = function() {
			try {
				var data = JSON.parse(this.responseText);
				callback(data);
			} catch(e) {
				Ti.API.log(e);
			};
		};
		xhr.open('GET', url);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send();
	};
	return api;
}());
