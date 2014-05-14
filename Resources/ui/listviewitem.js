exports.create = function(_station) {
	var dist, predictiontext, prediction = Ti.App.TideRadar.getPrediction(_station.id);
	if (_station.dist < 1000)
		dist = _station.dist + ' m';
	else if (_station.dist < 10000)
		dist = (_station.dist / 1000).toFixed(1) + ' km';
	else
		dist = Math.round(_station.dist / 1000) + ' km';
	if (prediction && prediction.current) {
		predictiontext = 'aktueller Pegel:  ';
		if (null != prediction.current.level) {
			predictiontext += (prediction.current.level + ' ' + Ti.App.TideRadar.getModus().toUpperCase());
			predictiontext += prediction.current.text;
		} else
			predictiontext = 'Es liegen keine Angaben zum Pegel vor.';

	}
	var item = {
		properties : {
			itemId : JSON.stringify(_station),
			accessoryType : (prediction && prediction.next) ? Ti.UI.LIST_ACCESSORY_TYPE_DETAIL : Ti.UI.LIST_ACCESSORY_TYPE_NONE,
		},
		label : {
			text : _station.label
		},
		dist : {
			text : "Entfernung:  " + dist
		},
		pegel : {
			text : predictiontext
		}
	};
	if (prediction && prediction.next) {
		item.next = {
			text : (null != prediction.current.level) //
				? 'nächstes ' + prediction.next.direction + ' (' + prediction.next.level + 'm)   ' + prediction.next.zeit + ' Uhr'//
				: 'nächstes ' + prediction.next.direction  + '   '+prediction.next.zeit + ' Uhr',
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
