exports.nearme = {
	properties : {
		height : Ti.UI.SIZE,
		layout : 'vertical'
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'label',
		properties : {
			color : '#333',
			width : Ti.UI.FILL,
			height : '30dp',
			font : {
				fontSize : '24dp',
				fontWeight : 'bold',
				fontFamily : Ti.App.CONF.hausschrift
			},
			left : '10dp',
			right : '10dp',
			top : '5dp'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'dist',
		properties : {
			color : '#333',
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : '14dip',
				fontWeight : 'bold',
				fontFamily : Ti.App.CONF.hausschrift
			},
			right : '10dip',
			left : '10dip',
			top : '5dp'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'pegel',
		properties : {
			color : '#333',
			font : {
				fontSize : '14dp',
				fontFamily : Ti.App.CONF.hausschrift
			},
			left : '10dip',
			top : '5dip'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'next',
		properties : {
			color : '#333',
			font : {
				fontSize : '14dp',
				fontFamily : Ti.App.CONF.hausschrift
			},
			left : '10dp',
			top : '5dp',
			bottom : '5dp'
		}
	}]
};

