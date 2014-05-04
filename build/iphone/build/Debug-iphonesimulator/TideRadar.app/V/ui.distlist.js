ui.dist = ( function() {
		var api = {};
		api.getDistWindow = function() {
			function fillListe(locs) {
				var rows = [];
				for (var i = 0; i < locs.length; i++) {
					//if(locs[i].dist > 90000)
					//	continue;
					rows[i] = Ti.UI.createTableViewRow({
						height : '80d',
						item : locs[i],
						hasChild : true,
					});
					var label = Ti.UI.createLabel({
						text : locs[i].label,
						height : '22dp',
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
					rows[i].add(label);
					var dist;
					if (locs[i].dist < 1000)
						dist = locs[i].dist + ' m';
					else if (locs[i].dist < 10000)
						dist = (locs[i].dist / 1000).toFixed(2) + ' km';
					else if (locs[i].dist < 100000)
						dist = (locs[i].dist / 1000).toFixed(1) + ' km';
					var distLabel = Ti.UI.createLabel({
						text : 'Entfernung:   ' + dist,
						height : '18dp',
						top : '35dp',
						textAlign : 'left',
						color : '#555',
						font : {
							fontSize : '14dp',
							fontFamily : 'Copse'
						},
						left : '10dp'
					});
					rows[i].add(distLabel);
					var subtitle = Ti.UI.createLabel({
						text : '',
						height : '15dp',
						top : '55p',
						textAlign : 'left',
						color : '#555',
						font : {
							fontSize : '14p',
							fontFamily : 'Copse'
						},
						left : '10dp'
					});
					if (locs[i].dist < 20000) {
						ctrl.tides.getForcast(locs[i].id, function(datas) {
							if (datas == null) {
								text = 'keine Daten vorhanden.';
							} else {
								var text = 'Tide: ';
								if (!isNaN(datas.current.level))
									text += (datas.current.level + 'm   ');
								text += datas.current.text;
							}
							subtitle.setText(text);

						});
					} else
						rows[i].setHeight(60);
					rows[i].add(subtitle);
				}

				liste.setData(rows);
			}

			var w = Ti.UI.createWindow({
				barColor : blue,
				fullscreen : true,
				title : 'Umgebung@TideRadar'
			});
			var liste = Ti.UI.createTableView({
				height : '100%',
				top : 15
			});
			var hint = Ti.UI.createLabel({
				height : 15,
				backgroundColor : 'red',
				top : 0,
				color : 'white',
				left : 0,
				font : {
					fontSize : 10
				},
				text : '  Ziehen erfrischt die Werte und speichert offline'
			});
			w.add(hint);
			var tableHeader = Ti.UI.createView({
				backgroundImage : "/assets/bunthaus2.jpg",
				width : Ti.Platform.displayCaps.platformWidth - 1,
				height : 140
			});
			var arrow = Ti.UI.createView({
				backgroundImage : "./assets/whiteArrow.png",
				width : 23,
				height : 60,
				bottom : 10,
				left : 20
			});
			var statusLabel = Ti.UI.createLabel({
				text : "Ziehe um zu  aktualisieren",
				left : 55,
				width : 200,
				bottom : 10,
				height : "auto",
				color : "silver",
				textAlign : "center",
				font : {
					fontSize : 13,
					fontWeight : "bold"
				},
				shadowColor : "#999",
				shadowOffset : {
					x : 0,
					y : 1
				}
			});
			var lastUpdatedLabel = Ti.UI.createLabel({
				text : "",
				left : 55,
				width : 220,
				bottom : 15,
				height : "auto",
				color : "#576c89",
				textAlign : "center",
				font : {
					fontSize : 12
				},
				shadowColor : "#999",
				shadowOffset : {
					x : 0,
					y : 1
				}
			});
			var actInd = Titanium.UI.createActivityIndicator({
				left : 20,
				bottom : 13,
				width : 30,
				height : 30
			});
			tableHeader.add(arrow);
			tableHeader.add(statusLabel);
			//	tableHeader.add(lastUpdatedLabel);
			tableHeader.add(actInd);
			liste.headerPullView = tableHeader;
			var pulling = false;
			var reloading = false;
			var self = this;
			function beginReloading() {
				setTimeout(endReloading, 1000);
			}

			function endReloading() {
				ctrl.stations.getDistList(fillListe);
				reloading = false;
				lastUpdatedLabel.text = "";
				statusLabel.text = "Ziehe runter!";
				actInd.hide();
				arrow.show();
				liste.setContentInsets({
					top : 0
				}, {
					animated : true
				});
			}

			if (Ti.Platform.osname != 'android' || true) {
				liste.addEventListener('scroll', function(e) {
					liste.setTop(0);

					var offset = e.contentOffset.y;
					var t;
					if (offset <= -65.0 && !pulling) {
						t = Ti.UI.create2DMatrix();
						t = t.rotate(-180);
						pulling = true;
						arrow.animate({
							transform : t,
							duration : 180
						});
						statusLabel.text = "Lass' los!";
					} else if (pulling && offset > -65.0 && offset < 0) {
						pulling = false;
						t = Ti.UI.create2DMatrix();
						arrow.animate({
							transform : t,
							duration : 180
						});
						statusLabel.text = "Zieh runter!";
					}
				});
				liste.addEventListener('scrollEnd', function(e) {
					if (pulling && !reloading && e.contentOffset.y <= -65.0) {
						reloading = true;
						pulling = false;
						arrow.hide();
						actInd.show();
						statusLabel.text = "Aktualisiere Tidedaten …";
						liste.setContentInsets({
							top : 60
						}, {
							animated : true
						});
						arrow.transform = Ti.UI.create2DMatrix();
						beginReloading();
					}
				});
			}

			liste.addEventListener('click', function(e) {
				var detailwindow = ui.tides.getDetail(e.rowData.item);

			});
			var stations = ctrl.stations.getDistList(fillListe);
			w.add(liste);
			return w;
		};
		return api;
	}());
