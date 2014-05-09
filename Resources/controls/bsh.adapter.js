var TideAdapter = function() {
	var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
	db.execute('DROP TABlE IF EXISTS tides');
	db.execute('CREATE TABLE tides (id TEXT, ts TEXT,ty TEXT,level TEXT)');
	db.close();
	var jsonfile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/M/locations.json');
	this.locations = JSON.parse(jsonfile.read());
	return this;
};
/* Helper function to calculate datas for now: */
var moment = require('vendor/moment');
moment.lang('de');
isArray = function(obj) {
	return Object.prototype.toString.call(obj) == "[object Array]";
};

var splitIntoDays = function(sets) {
	var days = [];
	var today = moment().startOf('day');
	var wds = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
	for (var i = 0; i < sets.length; i++) {
		var set = sets[i];
		var ndx, label;
		ndx = moment.unix(set.timestamp).diff(today, 'days');
		if (ndx < 3) {
			label = ['Heute', 'Morgen', 'Übermorgen'][ndx];
		} else {
			label = 'nächster ' + wds[moment.unix(set.timestamp).format('e')];
		}
		if (!days[ndx])
			days[ndx] = {};
		days[ndx].label = label;
		if (!days[ndx].tides)
			days[ndx].tides = [];
		days[ndx].tides.push({
			"i18n" : moment.unix(set.timestamp).format('HH:mm'),
			"direction" : set.direction,
			"level" : set.level,
			"in_past" : (moment().diff(moment.unix(set.timestamp)) > 0) ? true : false
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
		var date = moment.unix(sets[i].timestamp);
		if (date.diff(moment()) <= 0) {
			set.prev = sets[i];
		}
		if (date.diff(moment()) >= 0) {
			set.next = sets[i];
			break;
		}
	}
	set.diff.time = set.next.timestamp - set.prev.timestamp;
	set.current.timeratio = (moment().unix() - set.prev.timestamp) / set.diff.time;
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
					console.log('Error 110: ' + E);
					_onload({
						ok : false
					});
				}
				if (stations != null) {
					var count = 0;
					var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
					db.execute("BEGIN IMMEDIATE TRANSACTION");
					Ti.Android && Ti.UI.createNotification({
						message : stations.length + ' frische Tidedaten importiert.'
					}).show();
					for (var s = 0, len = stations.length; s < len; s++) {
						var id = stations[s].id;
						var val = stations[s].val;
						for (var i = 0; i < val.length; i++) {
							if (val)
								db.execute('INSERT INTO tides VALUES (?,?,?,?)', id, val[i].ts, val[i].ty, val[i].m);
						}
					}
					db.execute("COMMIT TRANSACTION");
					db.close();
					var stop = new Date().getTime();
					_onload({
						ok : true,
						total : val.length,
						latest : 'Montag'
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
	getStations : function() {
	},
	getFavsCount : function() {
		return this.getFavs().length;
	},
	getFavs : function() {
		var db = Ti.Database.open(Ti.App.Properties.getString('dbname'));
		var sql = 'SELECT * FROM `stations` WHERE fav=1 ORDER BY time DESC';
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
