module.exports = function(latte, level) {
	var lattenpositionen = [0, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14];
	for (var i = 0; i < lattenpositionen.length; i++) {
		var slot = lattenpositionen[i];
		var text = Math.round((parseFloat(level, 10) * 100 - slot * 10 + 47) / 10);
		var color = text > 0 ? 'black' : 'red';
		text = Math.abs(text);
		if (text < 10)
			text = '0' + text;
		var options = {
			color : color,
			font : {
				fontWeight : 'bold',
				fontSize : 18,
				fontFamily : 'SteelfishRg-Bold'
			},
			height : 20,
			top : 5 + 24.5 * slot,
			text : text,
		};
		if (slot % 2) {
			options.left = 3;
		} else {
			options.left = 16;
		}
		latte.add(Ti.UI.createLabel(options));
	}
	latte.animate(Ti.UI.createAnimation({
		right : 0
	}));
	latte.hand.animate(Ti.UI.createAnimation({
		top : 110,
		right : 5,
		duration : 3000
	}));
}; 