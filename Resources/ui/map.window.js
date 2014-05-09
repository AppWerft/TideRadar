Ti.Map = require('ti.map');

exports.create = function() {
	function setSubtitleofAnnotation(datas, pin) {/*
		 var date = moment().format('HH:mm');
		 var pegel = isNaN(datas.current.level) ? '' : 'Pegel: ' + datas.current.level + ' m';
		 var subtitle = date + ' Uhr,  ' + pegel + datas.current.text;
		 if (pin)
		 pin.subtitle = subtitle;*/
	}

	var self = Ti.UI.createWindow({
		title : 'Gezeitenkarte@TideRadar',
		barColor : Ti.App.CONF.blue
	});
	var pins = [];
	var pin;
	var annotation_busy = false;
	self.mapview = Ti.Map.createView({
		userLocation : false,
		enableZoomControls : false,
		mapType :  Ti.Map.TERRAIN_TYPE,
		animate : true,
		regionFit : true,
		region : {
			latitude : 53.55,
			longitude : 10,
			latitudeDelta : 0.7,
			longitudeDelta : 0.7
		}
	});
	self.mapview.addEventListener('complete', function() {
	});
	/*
	 var mapNavibar = Ti.UI.createScrollableView({
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
	 var index = mapNavibar.currentPage;
	 if (index > 0) {
	 mapNavibar.scrollToView(index - 1);
	 }
	 });
	 rightButton.addEventListener('click', function(e) {
	 var index = mapNavibar.currentPage;
	 if (index < views.length) {
	 mapNavibar.scrollToView(index + 1);
	 }
	 });
	 mapNavibar.add(leftButton);
	 mapNavibar.add(rightButton);
	 mapNavibar.addEventListener('longpress', function(e) {
	 //var detailWindow = ui.tides.getDetail(pins[mapNavibar.currentPage].item);

	 });
	 var locs = ctrl.stations.getLongitudeList();
	 var views = [];
	 for (var i = 0; i < locs.length; i++) {
	 views.push(Ti.UI.createLabel({
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
	 pins.push(require('ui/annotation.widget').create(locs[i], i));
	 }
	 mapNavibar.views = views;
	 mainMapView.addAnnotations(pins);

	 mainMapView.addEventListener('click', function(e) {
	 if (e.clicksource == 'pin') {
	 annotation_busy = true;
	 setTimeout(function() {
	 annotation_busy = false;
	 }, 1000);
	 pin = e.annotation;
	 mapNavibar.scrollToView(pin.index, {
	 duration : 1000
	 });
	 mainMapView.animate(Ti.UI.createAnimation({
	 height : Ti.UI.FILL
	 }));
	 mapNavibar.animate(Ti.UI.createAnimation({
	 bottom : 0
	 }));
	 /*Ti.App.Tides.getPrediction(pin.item.id, {
	 onOk : function(_prediction) {
	 setSubtitleofAnnotation(_prediction, pin);
	 }
	 });

	 } else {
	 console.log('Info: opening detail for ' + e.annotation.title);
	 //w.tab.open(ui.tides.getDetail(e.annotation.item));

	 }
	 });
	 mapNavibar.addEventListener('scroll', function(_e) {
	 if (annotation_busy == true)
	 return;
	 annotation_busy = true;
	 setTimeout(function() {
	 annotation_busy = false;
	 }, 1000);
	 var newannotation = pins[_e.currentPage];
	 mainMapView.selectAnnotation(newannotation);
	 var region = mainMapView.getRegion();
	 mainMapView.setLocation({
	 latitude : newannotation.latitude,
	 longitude : newannotation.longitude,
	 latitudeDelta : region.latitudeDelta > 0.5 ? 0.5 : region.latitudeDelta,
	 longitudeDelta : region.longitudeDelta > 0.5 ? 0.5 : region.longitudeDelta,
	 animate : true
	 });
	 });

	 Ti.Gesture.addEventListener('orientationchange', function(e) {
	 if (e.orientation == Ti.UI.PORTRAIT)
	 mainMapView.setMapType(Ti.Map.HYBRID_TYPE);
	 else
	 mainMapView.setMapType(Ti.Map.STANDARD_TYPE);
	 });

	 self.add(mapNavibar);*/
	self.addEventListener('focus', function() {
		self.add(self.mapview);
	});
	return self;
};
