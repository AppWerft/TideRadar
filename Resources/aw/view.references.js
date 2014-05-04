
view.references = ( function() {
		var api = {};
		api.getWindow = function() {
			var w = Ti.UI.createWindow({
				backgroundColor : '#444'
			});
			Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;
			w.navBarHidden = true;
			var toolbar = Ti.UI.createView({
				top : 0,
				height : 40,
				backgroundImage : Ti.Filesystem.resourcesDirectory + '/assets/aboutus/bg.jpg'
			});
			var topTitle = Ti.UI.createLabel({
				text : 'Apps der appWerft',
				color : 'white',
				height: 25,
				shadowColor : "#000",
				shadowOffset : {
					x : 1,
					y : 1
				},
				left : 10,
				font : {
					fontWeight : 'bold',
					fontSize : 20,
					fontFamily : 'TrumpTownPro'
				}
			});
			var aw = Ti.UI.createImageView({
				shadowColor : "#000",
				shadowOffset : {
					x : 1,
					y : 1
				},
				width : 90,
				right : 10,
				image : Ti.Filesystem.resourcesDirectory + 'assets/aboutus/aw.png'
			});
			toolbar.add(aw);
			toolbar.add(topTitle);
			toolbar.addEventListener('click', ctrl.contactDialog);
			w.add(toolbar);
			w.addEventListener('close', function() {
				w = null;
			});
			var actInd1 = Ti.UI.createActivityIndicator({
				style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
				message : "Hole Blog aus dem Netz",
				bottom : 2,
				width : 290,
				height : 50,
				color : '#555',
				padding : 10,
				opacity : 0.9,
				animation : true,
				font : {
					fontFamily : 'TrumpTownPro',
					fontSize : 14,
					fontWeight : 'bold'
				},
				animated : true
			});
			var referenceTable = Ti.UI.createTableView({
				top : 40,
				left : 0,
				bottom : 36,
				opacity : 0.99,
				width : '100%',
				borderWidth : 1

			});
			referenceTable.addEventListener('click', function(e) {
				if(e.rowData.installed)
					Ti.Platform.openURL(e.rowData.item.schema + '://');
				else
					Ti.Platform.openURL(e.rowData.appstore);
			});
			actInd1.show();

			ctrl.references.getAll('http://webmasterei.com/fileadmin/references.json', function(data) {
				setTimeout(function() {
					actInd.hide();
				}, 100);
				for(var i = 0; i < data.length; i++) {
					var item = data[i];
					var row = Ti.UI.createTableViewRow({
						height : 'auto',
						appstore : item.link,
						backgroundColor : 'black'
					});
					var title = Ti.UI.createLabel({
						font : {
							fontSize : 23,
							fontFamily : 'TrumpTownPro',
							fontWeight : 'bold'
						},
						top : 5,
						left : 75,
						height : 28,
						width : 280,
						color : '#aaa',
						text : item.title
					});
					var descr = Ti.UI.createLabel({
						font : {
							fontSize : Ti.Platform.displayCaps.platformWidth / 23,
							fontFamily : 'Arial'
						},
						top : 33,
						left : 75,
						right : 25,
						bottom : 15,
						color : '#eee',
						height : 'auto',
						text : item.descr
					});
					row.add(descr);
					var img = Ti.UI.createImageView({
						image : item.icon,
						defaultImage : 'assets/aw.png',
						width : 60,
						height : 60,
						top : 5,
						borderColor : '#999',
						borderRadius : 9,
						left : 5
					});
					var installed = (item.schema && Ti.Platform.canOpenURL(item.schema + '://')) ? true : false;
					row.installed = installed;
					row.item = item;
					var button = Ti.UI.createImageView({
						width : (installed) ? 18 : 22,
						height : (installed) ? 18 : 22,
						image : (installed) ? '/assets/start.png' : '/assets/install.png',
						right : 5 ,
					});
					row.add(button);
					ctrl.cachedImageView('refcache', item.icon, img, true);

					row.add(img);
					row.add(title);
					referenceTable.appendRow(row, {
						animationStyle : Titanium.UI.iPhone.RowAnimationStyle.LEFT,
						duration : 5000,
						delay : 1000
					});
				}
			})
			var blogTable = Ti.UI.createTableView({
				top : 40,
				left : Ti.Platform.displayCaps.platformWidth - 1,
				bottom : 35
			});
			self = this;
			ctrl.references.getBlog(function(b) {
				actInd1.hide();
				self.setBlog(blogTable, b);
			});
			var border = Ti.UI.createView({
				backgroundColor : "#576c89",
				height : 2,
				bottom : 0
			});
			var tableHeader = Ti.UI.createView({
				backgroundImage : "/assets/rainer.jpg",
				width : Ti.Platform.displayCaps.platformWidth - 1,
				height : 140
			});
			tableHeader.add(border);
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
			blogTable.headerPullView = tableHeader;
			var pulling = false;
			var reloading = false;
			function beginReloading() {
				setTimeout(endReloading, 1000);
			}

			function endReloading() {
				ctrl.references.getBlog(function(b) {
					self.setBlog(blogTable, b);

				});
				//velo.ctrl.getListofnextSchrauber();
				reloading = false;
				lastUpdatedLabel.text = "";
				statusLabel.text = "Ziehe runter!";
				actInd.hide();
				arrow.show();
				blogTable.setContentInsets({
					top : 0
				}, {
					animated : true
				});
			}

			if(Ti.Platform.osname != 'android' || true) {
				blogTable.addEventListener('scroll', function(e) {
					var offset = e.contentOffset.y;
					var t;
					if(offset <= -65.0 && !pulling) {
						t = Ti.UI.create2DMatrix();
						t = t.rotate(-180);
						pulling = true;
						arrow.animate({
							transform : t,
							duration : 180
						});
						statusLabel.text = "Lass' los!";
					} else if(pulling && offset > -65.0 && offset < 0) {
						pulling = false;
						t = Ti.UI.create2DMatrix();
						arrow.animate({
							transform : t,
							duration : 180
						});
						statusLabel.text = "Zieh runter!";
					}
				});
				blogTable.addEventListener('scrollEnd', function(e) {
					if(pulling && !reloading && e.contentOffset.y <= -65.0) {
						reloading = true;
						pulling = false;
						arrow.hide();
						actInd.show();
						statusLabel.text = "Aktualisiere Blog …";
						blogTable.setContentInsets({
							top : 60
						}, {
							animated : true
						});
						arrow.transform = Ti.UI.create2DMatrix();
						beginReloading();
					}
				});
			}
			if(Ti.Platform.osname != 'android') {
				var navi = Ti.UI.createTabbedBar({
					height : 30,
					style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
					backgroundColor : 'gray',
					width : '95%',
					index : 1,
					labels : ['Rainers Horen', 'Apps im Store'],
					bottom : 2
				});
				navi.addEventListener('click', function(e) {
					if(e.index == 0) {
						referenceTable.animate(Ti.UI.createAnimation({
							left : 319,
							duration : 300
						}));
						blogTable.animate(Ti.UI.createAnimation({
							left : 0,
							duration : 300
						}));
						topTitle.setText('Rainers Horen');
					}
					if(e.index == 1) {
						blogTable.animate(Ti.UI.createAnimation({
							left : 319,
							duration : 500
						}));

						referenceTable.animate(Ti.UI.createAnimation({
							left : 0,
							duration : 500
						}));
						topTitle.setText('Apps der appWerft');
					}
				});
				w.add(navi);
			}
			w.add(blogTable);
			w.add(referenceTable);
			w.add(actInd1);
			return w;
		};
		api.setBlog = function(tableView, b) {
			var rows = [];
			if (!b) return;
			for(var i = 0; i < b.length; i++) {
				var row = Ti.UI.createTableViewRow({
					layout : 'vertical',
					height : 'auto',
					backgroundColor : 'black',
					selectedBackgroundColor : '#333'
				});
				var datum = Ti.UI.createLabel({
					text : b[i].datum,
					left : 10,
					height : 30,
					top : 10,
					color : '#ccc',
					font : {
						fontSize : 23,
						fontFamily : 'TrumpTownPro',
						fontWeight : 'bold'
					}
				});
				row.add(datum);
				for(var e = 0; e < b[i].entry.length; e++) {
					if(b[i].entry[e].type == 'label') {
						var label = Ti.UI.createLabel({
							text : b[i].entry[e].content,
							top : 5,
							color : 'white',
							left : 10,
							right : 10,
							bottom : 10,
							height : 'auto'
						});
						row.add(label);
					}
					if(b[i].entry[e].type == 'img') {
						var imageurl = 'http://familientagebuch.de' + b[i].entry[e].content.src;
						var size = b[i].entry[e].content.size.split('x');
						var h = (Ti.Platform.displayCaps.platformWidth - 20) * size[1] / size[0];
						var image = Ti.UI.createImageView({
							image : imageurl,
							top : 5,
							bottom : 5,
							width : Ti.Platform.displayCaps.platformWidth - 20,
							height : h,
						});
						ctrl.cachedImageView('ic', b[i].entry[e].content.src, image, true);
						row.add(image);
					}
				}
				rows.push(row);
			}
			tableView.setData(rows);

		};
		return api;
	}());
