exports.create = function(item) {
	var self = require('ui/window').create({
		title : 'Gesamtliste@TideRadar'
	});
	self.search = Titanium.UI.createSearchBar();
	var locliste = Ti.UI.createTableView({
		backgroundImage : '/assets/bunthaus1.jpg'
	});
	locliste.addEventListener('click', function(e) {
		var win = require('ui/stationhomepage.window').create(e.row.item);
		(Ti.Android) ? win.open(): self.tab.open(win);
	});
	var locs = Ti.App.TideRadar.getAlfaList();
	var sections = [];
	var ndx = 0;
	var index = [];
	var rowcounter = 0;
	for (var s in locs) {
		index.push({
			title : s,
			index : rowcounter
		});
		sections[ndx] = Ti.UI.createTableViewSection({
		});
		sections[ndx].headerTitle = s + ' …';
		var row;
		for (var i = 0; i < locs[s].length; i++) {
			rowcounter++;
			row = Ti.UI.createTableViewRow({
				height : '50dp',
				backgroundColor : 'white',
				item : locs[s][i],
				hasChild : true,
			});
			var label = Ti.UI.createLabel({
				text : locs[s][i].label,
				color : '#444',
				width : Ti.UI.FILL,
				font : {
					fontSize : '24dp',
					fontWeight : 'bold',
					fontFamily : 'Copse'
				},
				left : '10dp'
			});
			row.add(label);
			sections[ndx].add(row);
		}
		ndx++;
	}
	locliste.data = sections;
	locliste.index = index;
	self.add(locliste);
	return self;
};
