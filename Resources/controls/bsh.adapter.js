var TideAdapter = function() {
	var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/M/locations.json');
	this.locations = JSON.parse(jsonfile.read());
	var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
	db.execute('CREATE TABLE IF NOT EXISTS favs (id TEXT, atime TEXT)');
	db.close();
	return this;
};
/* Helper function to calculate datas for now: */

isArray = function(obj) {
	return Object.prototype.toString.call(obj) == "[object Array]";
};
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
var splitIntoDays = function(sets) {
	var days = [];
	var today = Ti.App.Moment().startOf('day');
	var wds = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
	for (var i = 0; i < sets.length; i++) {
		var set = sets[i];
		var ndx, label;
		ndx = Ti.App.Moment.unix(set.timestamp).diff(today, 'days');
		if (ndx < 3) {
			label = ['Heute', 'Morgen', 'Übermorgen'][ndx];
		} else {
			label = 'nächster ' + wds[Ti.App.Moment.unix(set.timestamp).format('e')];
		}
		if (!days[ndx])
			days[ndx] = {};
		days[ndx].label = label;
		if (!days[ndx].tides)
			days[ndx].tides = [];
		days[ndx].tides.push({
			"i18n" : Ti.App.Moment.unix(set.timestamp).format('HH:mm'),
			"direction" : set.direction,
			"level" : set.level,
			"in_past" : (Ti.App.Moment().diff(Ti.App.Moment.unix(set.timestamp)) > 0) ? true : false
		});
	}
	return days;
};
var getCurrent = function(sets) {
	if (sets[0].level) {
		var min = 99999;
		var max = 0;
		// Extrema:
		for (var i = 0; i < sets.length; i++) {
			if (min < sets[i].level)
				min = sets[i].level;
			if (max > sets[i].level)
				max = sets[i].level;
		}
	}
	var set = {
		prev : {},
		next : {},
		diff : {
			level : 0,
			time : 0
		},
		current : {
			level : null,
			timeratio : null,
		}
	};
	for (var i = 0; i < sets.length - 1; i++) {
		var date = Ti.App.Moment.unix(sets[i].timestamp);
		if (date.diff(Ti.App.Moment()) <= 0) {
			set.prev = sets[i];
		}
		if (date.diff(Ti.App.Moment()) >= 0) {
			set.next = sets[i];
			break;
		}
	}
	set.diff.time = set.next.timestamp - set.prev.timestamp;
	set.current.timeratio = (Ti.App.Moment().unix() - set.prev.timestamp) / set.diff.time;
	try {
		set.diff.level = parseFloat(set.next.level, 10) - parseFloat(set.prev.level, 10);
	} catch(E) {
		console.log('Error 77: ' + E);
	}
	if (set.diff.level != 0) {
		var amp = Math.abs(parseFloat(set.prev.level, 10) - parseFloat(set.next.level, 10));
		var cosinus = Math.cos(set.current.timeratio * Math.PI);
		if (set.diff.level < 0) {
			// ablaufend
			var level = parseFloat(set.next.level, 10);
			level = (amp / 2 + cosinus * amp / 2 + level);
		} else {
			// auflaufend
			var level = parseFloat(set.prev.level, 10);
			level = (amp / 2 - cosinus * amp / 2 + level);
		}
		set.current.level = level.toFixed(2);
		set.current.direction = (set.prev.type == 'HW') ? '-' : '+';
		set.current.text = (set.prev.type == 'HW') ? '⬇ ablaufend' : '⬆ auflaufend';
	}
	return set;
};

TideAdapter.prototype = {
	getLongitudeList : function() {
		var stations = this.locations.slice(0);
		for (var i = 0; i < stations.length; i++) {
			stations[i].lng = stations[i].gps.split(',')[1];
		}
		stations.sort(function(a, b) {
			if (a.lng < b.lng) {
				return -1;
			}
			if (a.lng > b.lng) {
				return 1;
			}
			return 0;
		});

		return stations;
	},
	getAlfaList : function() {
		var out = {};
		for (var i = 0; i < this.locations.length; i++) {
			var fc = this.locations[i].label.substr(0, 1);
			if ( typeof (out[fc]) != 'object')
				out[fc] = [];
			out[fc].push(this.locations[i]);
		}
		return out;
	},

	getDistList : function(callback) {
		var stations = this.locations.slice(0);
		Ti.Geolocation.purpose = "Ermittle Position";
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				var mylat = 53.5;
				var mylng = 10;
			} else {
				var mylat = e.coords.latitude;
				var mylng = e.coords.longitude;
			}
			for (var i = 0; i < stations.length; i++) {
				stations[i].dist = getDistance(stations[i].gps.split(',')[0], stations[i].gps.split(',')[1], mylat, mylng);
			}
			stations.sort(function(a, b) {
				if (a.dist < b.dist) {
					return -1;
				}
				if (a.dist > b.dist) {
					return 1;
				}
				return 0;
			});
			Ti.App.addEventListener('mapblur', function() {
				for (var i = 0; i < 17; i++) {
					ctrl.tides.getForcast(stations[i].id, function(datas) {
					});
				}
			});
			callback(stations);
		});
	},
	loadStations : function(_args, _onload) {
		var that = this;
		var start = new Date().getTime();
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				var stations = null;
				var stop = new Date().getTime();
				try {
					stations = JSON.parse(this.responseText);
					var stop = new Date().getTime();
				} catch(E) {
					_onload({
						ok : false
					});
				}
				if (stations != null) {
					var count = 0;
					var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
					db.execute('DROP TABlE IF EXISTS tides');
					db.execute('CREATE TABLE IF NOT EXISTS tides (id TEXT, ts TEXT,ty TEXT,level TEXT)');
					db.execute("BEGIN IMMEDIATE TRANSACTION");
					for (var s = 0, len = stations.length; s < len; s++) {
						var id = stations[s].id;
						var val = stations[s].val;
						for (var i = 0; i < val.length; i++) {
							if (val) {
								count++;
								db.execute('INSERT INTO tides VALUES (?,?,?,?)', id, val[i].ts, val[i].ty, val[i].m);
							}
						}
						Ti.App.Properties.setList(id,stations[s].weather);
					}
					db.execute("COMMIT TRANSACTION");
					var sql = 'SELECT ts FROM `tides` ORDER BY ts DESC';
					var resultSet = db.execute(sql);
					if (resultSet.isValidRow()) {
						var latest = resultSet.fieldByName('ts');
					}
					resultSet.close();
					db.close();
					var stop = new Date().getTime();
					_onload({
						ok : true,
						total : count,
						latest : Ti.App.Moment.unix(latest).format('LLL')
					});
				}
			},
			onerror : function(e) {
				Ti.Android && Ti.UI.createNotification({
					message : 'Nicht im Netz: benutzte alte Daten'
				}).show();
				_onload({
					ok : false
				});
			}
		});
		xhr.open('GET', Ti.App.Properties.getString('ENDPOINT'));
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.send();
	},
	getFavsCount : function() {
		var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var total = 0;
		var resultSet = db.execute('SELECT count(*) AS total FROM `favs` GROUPED BY id');
		if (resultSet.isValidRow()) {
			total = resultSet.fieldByName('total');
			resultSet.close();
		}
		db.close();
		return total;
	},
	setFav : function(_id) {
		var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var resultSet = db.execute('INSERT INTO favs VALUES (?,?)', _id, Ti.App.Moment());
		db.close();
	},
	getFavs : function() {
		var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		/*var sql = 'SELECT count(*) AS total FROM `favs` GROUPED BY id';
		 var resultSet = db.execute(sql);
		 var stations = [];
		 while (resultSet.isValidRow()) {
		 stations.push({
		 id : resultSet.fieldByName('id'),
		 label : resultSet.fieldByName('label'),
		 gps : resultSet.fieldByName('gps')
		 });
		 resultSet.next();
		 }
		 resultSet.close();
		 db.close();
		 return stations;
		 },
		 setFav : function(_id) {
		 var now = new Date();
		 var favs = {
		 "alt" : this.getFavsCount(),
		 "neu" : null
		 };
		 var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		 var sql = 'UPDATE `stations` SET fav=1, time=' + Math.round(now.getTime()) + ' WHERE id="' + _id + '"';
		 db.execute(sql);
		 favs.neu = this.getFavsCount();
		 if (favs.alt != favs.neu) {
		 Ti.App.fireEvent('favadd', {
		 "favs" : favs
		 });
		 }
		 db.close();
		 */
	},
	getPrediction : function(_id, _callbacks) {
		var that = this;
		var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var resultSet = db.execute('SELECT * FROM tides  WHERE id=? ORDER by ts', _id);
		var tidedatas = [];
		while (resultSet.isValidRow()) {
			tidedatas.push({
				timestamp : parseInt(resultSet.fieldByName('ts')),
				level : resultSet.fieldByName('level'),
				direction : resultSet.fieldByName('ty'),
			});
			resultSet.next();
		}
		resultSet.close();
		db.close();
		if (tidedatas.length > 0) {
			_callbacks.onOk({
				current : getCurrent(tidedatas).current,
				predictions : splitIntoDays(tidedatas)
			});
		}
	}
};

module.exports = TideAdapter;
