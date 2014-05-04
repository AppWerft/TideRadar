ui.favs = ( function() {
	var api = {};

	api.getFavListe = function(item) {
		var w = Ti.UI.createWindow({
			barColor : blue,
			title : 'Favoriten@TideRadar'
			
		});
		var liste = Ti.UI.createTableView({
			height : '100%',
			headerPullView : Ti.UI.createView({
				width : '100%',
				height : 480,
				backgroundImage : '/assets/bunthaus2.jpg'
			})
		});
		liste.addEventListener('click', function(e) {
			var detailwindow = ui.tides.getDetail(e.rowData.item);
			
		});
		w.add(liste)
		w.addEventListener('focus', function() {
			ctrl.stations.setFav();
			ctrl.stations.getFavs(function(favs) {
				var rows = [];
				for(var i = 0; i < favs.length; i++) {
					rows[i] = Ti.UI.createTableViewRow({
						height : 40,
						item : favs[i],
						backgroundColor : 'white',
						hasChild : true,
					});
					var label = Ti.UI.createLabel({
						text : favs[i].label,
						height : 40,
						textAlign : 'left',
						color : '#444',
						font : {
							fontSize : 18,
							fontWeight : 'bold',
							fontFamily : 'Copse'
						},
						left : 10
					});
					rows[i].add(label);
					liste.setData(rows);
				}
			});
		});
		return w;
	};
	return api;
}());
