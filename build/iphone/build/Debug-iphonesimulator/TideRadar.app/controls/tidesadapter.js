module.exports = TideAdapter;

var TideAdapter = function() {
	return this;
};

TideAdapter.prototype = {
	loadStations : function() {
		console.log('start Sync');
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				console.log(this.responseText);
			},
			onerror: function(e) {
				console.log(e);
			}
		});
		xhr.open('GET', 'http://familientagebuch.de/tideradar/');
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('X-Tide', Ti.Utils.md5HexDigest(time()));
		xhr.send();
	},
	getStations : function() {
	}
};
