ui.loclist = ( function() {
		var api = {};
		api.getAlfaListWindow = function(item) {
			var w = Ti.UI.createWindow({
				title : 'Gesamtliste@TideRadar',
				barColor : blue,fullscreen:true

			});
			var search = Titanium.UI.createSearchBar();
			var locliste = Ti.UI.createTableView({
				search : search,
				height : '100%',
				backgroundImage : 'assets/bunthaus1.jpg'
			});
			locliste.addEventListener('click', function(e) {
				var detailwindow = ui.tides.getDetail(e.rowData.item);

			});
			var locs = ctrl.stations.getAlfaList();
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
						height : '40dp',
						item : locs[s][i],
						hasChild : true,
					});
					var label = Ti.UI.createLabel({
						text : locs[s][i].label,
						height : '20dp',
						top : '5dp',
						textAlign : 'left',
						color : '#444',
						font : {
							fontSize : '16dp',
							fontWeight : 'bold',
							fontFamily : 'Copse'
						},
						left : 10
					});
					row.add(label);
					sections[ndx].add(row);
				}
				ndx++;
			}

			locliste.data = sections;
			locliste.index = index;
			w.add(locliste);
			return w;
		};
		return api;
	}());
