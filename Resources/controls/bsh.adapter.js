

var TideAdapter = function() {
	return this;
};

TideAdapter.prototype = {
	loadStations : function() {
		var that =this;
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				that.tides = JSON.parse(this.responseText);
			},
			onerror: function(e) {
				console.log(e);
			}
		});
		xhr.open('GET', Ti.App.Properties.getString('ENDPOINT'));
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.send();
	},
	getStations : function() {
	}
};

module.exports = TideAdapter;