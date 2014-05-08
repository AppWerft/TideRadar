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
	var getDistance = function(lat1, lon1, lat2, lon2) {
		var R = 6371000;
		// m (change this constant to get miles)
		var dLat = (lat2 - lat1) * Math.PI / 180;
		var dLon = (lon2 - lon1) * Math.PI / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return Math.round(d);
	};
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
	api.getLongitudeList = function(callback) {
		var stations = locations.slice(0);
		for(var i = 0; i < stations.length; i++) {
			stations[i].lng = stations[i].gps.split(',')[1];
		}
		stations.sort(function(a, b) {
			if(a.lng < b.lng) {
				return -1;
			}
			if(a.lng > b.lng) {
				return 1;
			}
			return 0;
		});
		if(callback != null)
			callback(stations);
		else
			return stations;
	};

	api.getAlfaList = function() {
		var out = {};
		for(var i = 0; i < locations.length; i++) {
			var fc = locations[i].label.substr(0, 1);
			if( typeof (out[fc]) != 'object')
				out[fc] = [];
			out[fc].push(locations[i]);
		}
		return out;
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
	api.getDistList = function(callback) {
		var stations = locations.slice(0);
		Ti.Geolocation.purpose = "Ermittle Position";
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if(e.error) {
				var mylat = 53.5;
				var mylng = 10;
			} else {
				var mylat = e.coords.latitude;
				var mylng = e.coords.longitude;
			}
			for(var i = 0; i < stations.length; i++) {
				stations[i].dist = getDistance(stations[i].gps.split(',')[0], stations[i].gps.split(',')[1], mylat, mylng);
			}
			stations.sort(function(a, b) {
				if(a.dist < b.dist) {
					return -1;
				}
				if(a.dist > b.dist) {
					return 1;
				}
				return 0;
			});
			Ti.App.addEventListener('mapblur', function() {
				for(var i = 0; i < 17; i++) {
					ctrl.tides.getForcast(stations[i].id, function(datas) {
					});
				}
			});
			callback(stations);
		});
	};
	return api;
}());
