exports.create = function(loc) {
	var self = Ti.UI.createTableViewRow({
		height : '80dp',
		item : loc,
		hasChild : true,
		backgroundColor : 'white',
		layout : 'vertical'
	});
	var label = Ti.UI.createLabel({
		text : loc.label,
		height : '24dp',
		top : '5dp',
		textAlign : 'left',
		color : '#444',
		font : {
			fontSize : '20dp',
			fontWeight : 'bold',
			fontFamily : 'Copse'
		},
		left : 10
	});
	self.add(label);
	var dist;
	if (loc.dist < 1000)
		dist = loc.dist + ' m';
	else if (loc.dist < 10000)
		dist = (loc.dist / 1000).toFixed(1) + ' km';
	else 
		dist = Math.round(loc.dist / 1000) + ' km';
	var distLabel = Ti.UI.createLabel({
		text : 'Entfernung:   ' + dist,
		height : '20dp',
		top : 0,
		textAlign : 'left',
		color : '#555',
		font : {
			fontSize : '14dp',
			fontFamily : 'Copse'
		},
		left : '10dp'
	});
	self.add(distLabel);
	self.subtitle = Ti.UI.createLabel({
		text : 'Dieses Jahr wird dieser Meßpunkt nicht abgefragt',
		height : '18dp',
		top : 0,
		textAlign : 'left',
		color : '#555',
		font : {
			fontSize : '14dp',
			fontFamily : 'Copse'
		},
		left : '10dp'
	});
	self.add(self.subtitle);
	Ti.App.TideRadar.getPrediction(loc.id, {
		onOk : function(_predictions) {
			var current = _predictions.current;
			var text = 'jetzt: ';
			if (!isNaN(current.level))
				text += (current.level + 'm ');
			text += current.text;
			self.subtitle.setText(text);
		},
		onError : function() {

		}
	});
	return self;
};
