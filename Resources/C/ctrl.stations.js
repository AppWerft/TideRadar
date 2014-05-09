ctrl.stations = ( function() {
	var api = {};
	var latestid;
	var locations = [];
	api.lastposition = {
		"latitude" : null,
		"longitude" : null
	};
	var dummies = [];
	// allesmal saugen
	var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/M/locations.json');
	locations = JSON.parse(jsonfile.read());
	var db= Ti.Database.open(Ti.App.Properties.getString('dbname'));
	db.execute('CREATE TABLE IF NOT EXISTS stations (fav INT,label TEXT, gps TEXT,  time INT,id TEXT, day TEXT,sets TEXT,daysets TEXT,UNIQUE (id))');
	var resultSet = db.execute('SELECT COUNT(*) AS total FROM stations');
	if(resultSet.isValidRow()) {
		if(resultSet.fieldByName('total') == 0) {
			Ti.App.fireEvent('app:init',{});
			db.execute("BEGIN IMMEDIATE TRANSACTION");
			var now = new Date();
			for(var i = 0; i < locations.length; i++) {
				var sql = 'INSERT INTO `stations` VALUES (0, "' + locations[i].label + '", "' + locations[i].gps + '", ' + Math.round(now.getTime() / 1000) + ', "' + locations[i].id + '","","","")';
				db.execute(sql);
			}
			db.execute("COMMIT TRANSACTION");
		}
	}
	resultSet.close();
	db.close();
	
	api.getAllLocations = function() {
		return locations;
	};
	api.setLatest = function(id) {
		latestid = id;
	};
	api.getFavsCount = function() {
		return this.getFavs().length;
	};

	api.setFav = function(id) {
		
		var now = new Date();
		var favs = {
			"alt" : this.getFavsCount(),
			"neu" : null
		};
		var db= Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var sql = 'UPDATE `stations` SET fav=1, time=' + Math.round(now.getTime()) + ' WHERE id="' + id + '"';
		db.execute(sql);
		favs.neu = this.getFavsCount();
		if(favs.alt != favs.neu) {
			Ti.App.fireEvent('favadd', {
				"favs" : favs
			});
		}
		db.close();
	};
	api.getFavs = function(callback) {
		var db= Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var sql = 'SELECT * FROM `stations` WHERE fav=1 ORDER BY time DESC';
		var resultSet = db.execute(sql);
		var stations = [];
		while(resultSet.isValidRow()) {
			var item = {};
			item['id'] = resultSet.fieldByName('id');
			item['label'] = resultSet.fieldByName('label');
			item['gps'] = resultSet.fieldByName('gps');
			stations.push(item);
			resultSet.next();
		}
		Ti.App.addEventListener('mapblur', function() {
			for(var i = 0; i < stations.length; i++) {
				ctrl.tides.getForcast(stations[i].id, function(datas) {
				});
			}
		});
		resultSet.close();
		db.close();
		if(callback != null)
			callback(stations);
		else
			return stations;
	};
	

	
	api.getPosition = function(callback) {
		Ti.Geolocation.purpose = "Ermittle Position";
		Ti.Geolocation.getCurrentPosition(function(e) {
			if(e.error) {
				callback(null);
			} else {
				callback(e.coords);
			}
		});
	};
	api.getGeoInfos = function() {
		Ti.Geolocation.purpose = "Ermittle Position";
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if(e.error) {
				Ti.App.fireEvent('ready.geo', {
					"coords" : null
				});

			} else {
				var coords = {
					"coords" : e.coords,
					"prevcoords" : ctrl.stations.lastposition
				};
				Ti.App.fireEvent('ready.geo', coords);
				Ti.App.fireEvent('ready.altitude', {
					altitude : e.coords.altitude
				});
				ctrl.stations.lastposition = {
					"latitude" : e.coords.latitude,
					"longitude" : e.coords.longitude
				};
				if(getDistance(e.coords.latitude, e.coords.longitude, ctrl.stations.lastposition.longitude) < 30) {
					var xhr = Ti.Network.createHTTPClient();
					xhr.onerror = function() {
					};
					xhr.onload = function() {
						try {
							var response = JSON.parse(this.responseText);
							if(response.status == 'OK') {
								Ti.App.fireEvent('ready.altitude', {
									altitude : response.results[0].elevation
								});
							} else {
								Ti.App.fireEvent('ready.altitude', {
									altitude : e.coords.altitude
								});

							}
						} catch(E) {
							Ti.API.log(E);
						}
					};
					var url = 'http://maps.google.com/maps/api/elevation/json?sensor=true&locations=' + e.coords.latitude + ',' + e.coords.longitude;
					xhr.open('GET', url);

					xhr.send();
				}
			}
		});
	};
	api.getWeather = function(gps, callback) {
		gps = gps.replace(',','%21');
		var url = 'http://api.worldweatheronline.com/free/v1/marine.ashx?q=' + gps + '&format=json&key=c2h262ekm6a4nrkc448s2zme';
		Ti.API.log(url);
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onerror = function() {
			Ti.API.log('xhrerror');
		};
		xhr.onload = function() {
			try {
				var response = JSON.parse(this.responseText);
				callback(response.data.weather);
			} catch(E) {
				Ti.API.log(E);
			}
		};
		xhr.open('GET', url);
		xhr.send();
	};
	
	return api;
}());
