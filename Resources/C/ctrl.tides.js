ctrl.tides = ( function() {
		var api = {};
		Ti.include('date.js');
		function getDayOffset(ddmm) {
			var wds = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
			var tage = ['Heute', 'Morgen', 'Übermorgen'];
			for(var offset = 0; offset < 10; offset++) {
				var datestring = new Date.today().add({
					days : offset
				}).toString('dd.MM.');
				if(datestring == ddmm) {
					var res = {
						offset : offset
					};
					if(offset < 3)
						res.day = tage[offset];
					return res;
				}
			}
			return offset;
		}

		function isPast(hhmm) {
			var now = new Date().toString('HH:mm');
			if(hhmm < now)
				return true;
			return false;
		}


		api.getCurrent = function(sets, time) {// if time == null: 'now'
			if(sets[0].level) {
				var min = 9999;
				var max = 0;
				// Extremaa:
				for(var i = 0; i < sets.length; i++) {
					if(min < sets[i].level)
						min = sets[i].level;
					if(max > sets[i].level)
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
			for(var i = 0; i < sets.length - 1; i++) {
				var date = Date.parse(sets[i].date);
				if(date.compareTo(new Date()) <= 0) {
					set.prev = sets[i];
				}
				if(date.compareTo(new Date()) >= 0) {
					set.next = sets[i];
					break;
				}
			}
			set.diff.time = Date.parse(set.next.date).getTime() - Date.parse(set.prev.date).getTime();
			var nowdate = new Date();
			var nowtime = nowdate.getTime();
			set.current.timeratio = (nowtime - Date.parse(set.prev.date).getTime()) / set.diff.time;
			try {
				set.diff.level = parseFloat(set.next.level, 10) - parseFloat(set.prev.level, 10)
			} catch(E) {
			}
			if(set.diff.level != null) {
				var amp = Math.abs(parseFloat(set.prev.level, 10) - parseFloat(set.next.level, 10));
				var cosinus = Math.cos(set.current.timeratio * Math.PI);
				if(set.diff.level < 0) {
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
			return set.current;
		};
		api.getTideValues = function(options) {
			var y1 = options.y1;
			var y2 = options.y2;
			var t1 = options.t1;
			var t2 = options.t2;
			var now = new Date();
			var steps = options.steps * 10;
			var amp = Math.abs(y2 - y1) / 2;
			var values = [];
			var timestamps = [];
			var diff = (t2.getTime() - t1.getTime()) / 1000;
			for(var s = 0; s < 100000; s++) {
				var myt1 = t1.clone();
				var timestamp = myt1.add({
					seconds : s * steps
				});
				var value = Math.cos(s * steps / diff * Math.PI);
				if(y2 > y1) {
					value = (amp - value * amp + y1).toFixed(3);
				} else {
					value = (amp + value * amp + y2).toFixed(3);
				}
				if(now.compareTo(timestamp) <= 0) {
					values.push(value);
					timestamps.push(timestamp);
				}
				if(myt1.compareTo(t2) > 0)
					break;
			}

			return {
				"values" : values,
				"timestamps" : timestamps
			};
		};
		api.getForcast = function(id, callback) {
			var self = this;
			ctrl.stations.setLatest(id);
			var db= Ti.Database.open(Ti.App.Properties.getString('dbname'));
			var sql = 'SELECT sets, daysets FROM `stations` WHERE id="' + id + '" AND day="' + new Date().toString('yyyy-MM-dd') + '"';
			var resultSet = db.execute(sql);
		     if(resultSet.isValidRow()) {
				try {
					var sets = JSON.parse(resultSet.fieldByName('sets'));
					var daysets = JSON.parse(resultSet.fieldByName('daysets'));
					resultSet.close();
					var current = self.getCurrent(sets, null);
					var res = {
						"daysets" : daysets,
						"current" : current,
						"events" : sets
					};
					if(typeof(callback) == 'function') {
						callback(res);
						return;
					}
				} catch(E) {
					var sql = 'UPDATE `stations` SET day=NULL, sets=NULL, daysets=NULL WHERE id="' + id + '"';
					ctrl.dbconn.execute(sql);
					Ti.API.log(E);
					if(typeof(callback) == 'function') {
						Ti.API.log('JSON kaputt');
						callback(null);
					} else
						return null;
				};
			}
			var url = 'http://mobile.bsh.de/cgi-bin/gezeiten/was_mobil.pl?ort=' + id + '&zone=Gesetzliche+Zeit&niveau=KN';
			this.latest = id;
			var self = this;
			var online = (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) ? false : true;
			if(online == false) {
					callback(null);
					return null;
			}
			Ti.Yahoo.yql("select * from html where url=\"" + url + "\" and xpath=\"//table\"", function(res) {
				var offset = 0;
				var daysets = [];
				//tagessortiert
				var sets = [];
				// alle sets ohne Tageseinteilung
				if(res.success == 0 || res.data==null) {
					callback(null);
					return null;
				}
				var rows = res.data.table.tr;
				for(var d = 1; d < rows.length; d++) {
					var elem = rows[d].td;
					if(elem.bgcolor)
						continue;
					try {
						var offset = getDayOffset(elem[1].p).offset;
						var day = (getDayOffset(elem[1].p).day) ? getDayOffset(elem[1].p).day : elem[0].p;
						if( typeof (daysets[offset]) != 'object')
							daysets[offset] = {
								"day" : day
							};
						if( typeof (daysets[offset].events) == 'undefined')
							daysets[offset].events = [];
						var hh = elem[3].p.split(':')[0];
						var mm = elem[3].p.split(':')[1];
						var item = {
							"type" : elem[2].p,
							"date" : new Date().clearTime().add({
								days : offset,
								hours : hh,
								minutes : mm
							}).toString('yyyy-MM-dd HH:mm:ss'),
							"time" : hh + ':' + mm,
							"ispast" : (offset) ? false : isPast(elem[3].p)
						};
						if(elem.length > 4)
							item.level = parseFloat(elem[4].p, 10);
						daysets[offset].events.push(item);
						sets.push(item);
					} catch(E) {
						Ti.API.error(E);
					}
				}
				var sql = 'UPDATE `stations` SET day="' + new Date().toString('yyyy-MM-dd') + '", sets=\'' + JSON.stringify(sets) + '\',daysets=\'' + JSON.stringify(daysets) + '\' WHERE id="' + id + '"';
				db.execute(sql);
				var current = self.getCurrent(sets, null);
				var res = {
					"daysets" : daysets,
					"current" : current,
					"events" : sets
				};
				db.close();
				if(callback != null) {
					Ti.API.log('Datas from net');
					callback(res);
				} else
					return res;
			});
		};
		api.getCurveData = function(id,_callback) {
			var self = this;
			this.getForcast(id, function(datas) {
				var counter = 0;
				var tides = [];
				var now = new Date();
				for(var i = 0; i < datas.events.length; i++) {
					var date = Date.parse(datas.events[i].date);
					if(date.compareTo(now) < 0) {
						tides[0] = {
							"timestamp" : datas.events[i].date,
							"pegel" : datas.events[i].level,
						};
					} else {
						tides.push({
							"timestamp" : datas.events[i].date,
							"pegel" : datas.events[i].level
						});
						counter++;
						if(counter == 4)
							break;
					}
				}
				/********** */
				var chartvalues=[];
				var ups=[];
				var downs=[];
				var timestamps= [];
				var endzeit;
				for(var i=0; i < tides.length - 1; i++) {
					endzeit=tides[i + 1].timestamp;
					var values = self.getTideValues({
						y1 : tides[i].pegel,
						y2 : tides[i + 1].pegel,
						t1 : tides[i].timestamp,
						t2 : tides[i + 1].timestamp,
						steps : 30
					});
					for (var j=0;j < values.values.length;j++) {
						chartvalues.push(values.values[j]);
				    	if (tides[i + 1].pegel > tides[i].pegel) {
				    		downs.push(values.values[j]);
				    		ups.push(null);
				    	} else {
				    		ups.push(values.values[j]);
				    		downs.push(null);
				    	}
					}
					for (var j=0;j < values.timestamps.length;j++) {
						timestamps.push(values.timestamps[j]);
					}
					var interval=(timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime()) / 5400;
					var js='initChart({"title":"Tide der nächsten Tage","datas":[' 
						+ chartvalues + '],"ups":[' 
						+ ups + '],"downs":['
						+ downs + '], "interval":'
						+ interval * 18.3 + '});';
			   }
				if (typeof(_callback)=='function') _callback(js);
				/*********** */
			});
		};
		api.getTideValues = function(options) {
			var y1 = options.y1;
			var y2 = options.y2;
			var t1 = Date.parse(options.t1);
			var t2 = Date.parse(options.t2);
			var now = new Date();
			var steps = options.steps * 10;
			var amp = Math.abs(y2 - y1) / 2;
			var values = [];
			var timestamps = [];
			var diff = (t2.getTime() - t1.getTime()) / 1000;
			for(var s = 0; s < 100000; s++) {
				var myt1 = t1.clone();
				var timestamp = myt1.add({
					seconds : s * steps
				});
				var value = Math.cos(s * steps / diff * Math.PI);
				if(y2 > y1) {
					value = (amp - value * amp + y1).toFixed(3);
				} else {
					value = (amp + value * amp + y2).toFixed(3);
				}
				if(now.compareTo(timestamp) <= 0) {
					values.push(value);
					timestamps.push(timestamp);
				}
				if(myt1.compareTo(t2) > 0)
					break;
			}

			return {
				"values" : values,
				"timestamps" : timestamps
			};
		};
		return api;
	}());
