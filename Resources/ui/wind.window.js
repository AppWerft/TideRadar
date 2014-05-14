exports.create = function(_label) {
	var self = Ti.UI.createWindow({
		barColor : '#479CFD',
		title : _label
	});
	self.web = Ti.UI.createWebView({
		disableBounce : true,
		scalesPageToFit : true,
		url : 'http://earth.nullschool.net/#current/wind/surface/level/orthographic=10.00,53.55,20127'
	});
	self.web.addEventListener('load', function() {
		
	});
	self.add(self.web);
	return self;
};
