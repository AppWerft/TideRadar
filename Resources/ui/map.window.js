Ti.Map = require('ti.map');
exports.create = function() {
	function setSubtitleofAnnotation(data, annotation) {
		
		var pegel = isNaN(data.current.level) ? '' : 'Pegel: ' + data.current.level + ' m';
		var subtitle = Ti.App.Moment().format('HH:mm') + ' Uhr,  ' + pegel + data.current.text;
		if (annotation)
			annotation.subtitle = subtitle;
	}
	var annotations=[], naviviews=[], annotation_busy = false;
	var self = Ti.UI.createWindow({
		title : 'Gezeitenkarte@TideRadar',
		barColor : Ti.App.CONF.blue
	});
	self.mapview = Ti.Map.createView({
		mapType : Ti.Map.SATELLITE_TYPE,
		userLocation : false,
		enableZoomControls : false,
		animate : true,
		regionFit : true,
		region : {
			latitude : 53.874,
			longitude : 8.75,
			latitudeDelta : 3.1,
			longitudeDelta : 3.1
		}
	});
	self.mapview.addEventListener('complete', function() {
	});
	self.mapnavibar = Ti.UI.createScrollableView({
		bottom : -50,
		height : 50,
		opacity : 0.6,
		showPagingControl : false,
		backgroundColor : 'black',
	});
	var leftButton = Ti.UI.createButton({
		left : 5,
		width : 25,
		height : 25,
		backgroundImage : '/assets/icon_arrow_left.png'
	});
	var rightButton = Ti.UI.createButton({
		right : 5,
		width : 25,
		height : 25,
		backgroundImage : '/assets/icon_arrow_right.png'
	});

	leftButton.addEventListener('click', function(e) {
		var index = self.mapnavibar.currentPage;
		if (index > 0) {
			self.mapnavibar.scrollToView(index - 1);
		}
	});
	rightButton.addEventListener('click', function(e) {
		var index = self.mapnavibar.currentPage;
		if (index < views.length) {
			self.mapnavibar.scrollToView(index + 1);
		}
	});
	self.mapnavibar.add(leftButton);
	self.mapnavibar.add(rightButton);
	self.mapnavibar.addEventListener('longpress', function(e) {
		//var detailWindow = ui.tides.getDetail(_e.annotations[self.mapnavibar.currentPage].item);

	});
	var locs = Ti.App.TideRadar.getLongitudeList();
	for (var i = 0; i < locs.length; i++) {
		annotations.push(require('ui/annotation.widget').create(locs[i], i));
		naviviews.push(Ti.UI.createLabel({
			textAlign : 'center',
			font : {
				fontFamily : 'Copse',
				fontSize : 22
			},
			color : 'white',
			height : 23,
			width : '90%',
			text : locs[i].label
		}));
	}
	self.mapnavibar.views = naviviews;
	self.mapview.addAnnotations(annotations);
	self.mapview.addEventListener('click', function(_e) {
		if (_e.clicksource == 'pin') {
			annotation_busy = true;
			setTimeout(function() {
				annotation_busy = false;
			}, 1000);
			self.mapnavibar.scrollToView(_e.annotation.index, {
				duration : 1000
			});
			self.mapnavibar.animate(Ti.UI.createAnimation({
				bottom : 0
			}));
			Ti.App.TideRadar.getPrediction(_e.annotation.itemId, {
				onOk : function(_prediction) {
					_prediction && setSubtitleofAnnotation(_prediction,_e.annotation);
				}
			});
		}
	});
	/*
	 self.mapnavibar.addEventListener('scroll', function(_e) {
	 if (annotation_busy == true)
	 return;
	 annotation_busy = true;
	 setTimeout(function() {
	 annotation_busy = false;
	 }, 1000);
	 var newannotation = _e.annotations[_e.currentPage];
	 self.mapview.selectAnnotation(newannotation);
	 var region = self.mapview.getRegion();
	 self.mapview.setLocation({
	 latitude : newannotation.latitude,
	 longitude : newannotation.longitude,
	 latitudeDelta : region.latitudeDelta > 0.5 ? 0.5 : region.latitudeDelta,
	 longitudeDelta : region.longitudeDelta > 0.5 ? 0.5 : region.longitudeDelta,
	 animate : true
	 });
	 });

	 Ti.Gesture.addEventListener('orientationchange', function(e) {
	 if (e.orientation == Ti.UI.PORTRAIT)
	 self.mapview.setMapType(Ti.Map.HYBRID_TYPE);
	 else
	 self.mapview.setMapType(Ti.Map.STANDARD_TYPE);
	 });

	 self.add(self.mapnavibar);*/
	self.addEventListener('open', function() {
		self.add(self.mapview);
	});
	return self;
};
