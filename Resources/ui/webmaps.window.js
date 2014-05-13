exports.create = function(_id, _label) {

	var self = Ti.UI.createWindow({
		barColor : '#479CFD',
		title : _label
	});
	self.web = Ti.UI.createWebView({
		url : '/html/maps.html'
	});
	self.web.addEventListener('load', function() {
		var js = "createMap('"+_id+"');";
		console.log(js);
		self.web.evalJS(js);
	});
	self.add(self.web);
	return self;
};
