exports.create = function(loc, onchanged) {
	var dist, predictiontext, prediction = Ti.App.TideRadar.getPrediction(loc.id);
	if (loc.dist < 1000)
		dist = loc.dist + ' m';
	else if (loc.dist < 10000)
		dist = (loc.dist / 1000).toFixed(1) + ' km';
	else
		dist = Math.round(loc.dist / 1000) + ' km';
	if (prediction && prediction.current) {
		predictiontext = 'aktueller Pegel: ';
		if (null != prediction.current.level) {
			predictiontext += (prediction.current.level + 'm ');
			predictiontext += prediction.current.text;
		} else
			predictiontext = 'Es liegen keine Angaben zum Pegel vor.';

	}
	var item = {
		properties : {
			itemId : JSON.stringify(loc),
			accessoryType : (prediction && prediction.next) ? Ti.UI.LIST_ACCESSORY_TYPE_DETAIL : Ti.UI.LIST_ACCESSORY_TYPE_NONE,
		},
		label : {
			text : loc.label
		},
		dist : {
			text : "Entfernung: " + dist
		},
		pegel : {
			text : predictiontext
		}
	};
	if (prediction && prediction.next) {
		var water = (prediction.next.direction == 'HW') ? 'Hochwasser: ' : 'Niedrigwasser: ';
		item.next = {
			text : 'nächstes ' + water + ' ' + prediction.next.zeit + ' Uhr',
			height : (prediction && prediction.next) ? Ti.UI.SIZE : 0
		};
	} else {
		item.pegel.height = 0;
		item.next = {
			text : '',
			height : 0
		};
	}
	return item;
};
