exports.get = function(gps, _callback) {
	// new key;
	var url = "http://free.worldweatheronline.com/feed/weather.ashx?q="+gps+
	"&format=json&num_of_days=5&key=c2h262ekm6a4nrkc448s2zme";
	console.log(url);var xhr = Ti.Network.createHTTPClient({
		timeout: 20000,
		onerror : function() {
			console.log("Error: problems with xhrerror");
		},
		onload : function() {
			try {
				var response = JSON.parse(this.responseText);
				if ( typeof (_callback) == "function")
					_callback(response.data.weather);
				} catch(E) {
					Ti.API.log(E);
				}
			}
		}
		);
	xhr.open("GET", url,true);
	xhr.send();
};
