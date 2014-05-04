

ctrl.references = ( function() {
	var api = {};
	api.getAll = function(url,callback) {
		var xhr = Titanium.Network.createHTTPClient({
			timeout : 25000
		});
		xhr.onload = function() {
			try {
				var data = JSON.parse(this.responseText);
				callback(data);
			} catch(e) {
				Ti.API.log(e);
			};
		};
		xhr.open('GET', url);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send();
	};
	api.getBlog = function(_callback) {
		var url = 'http://familientagebuch.de/rainer/tit.showlatestdays.php';
		var xhr = Ti.Network.createHTTPClient({timeout : 125000});
		xhr.onload = function() {
				try {
					var data = JSON.parse(this.responseText);
					_callback(data);
				} catch(e) {alert(e);};
		};
		xhr.onerror = function() 	{
					alert('Keine Netzverbindung.');
	
		};
		xhr.open('GET', url);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send();
	}
	return api;
}());

ctrl.cachedImageView = function(imageDirectoryName, url, imageViewObject, hires) {
	var filename = url.split('/');
	var hiresfilename;
	filename = filename[filename.length - 1];
	hiresfilename = filename.split('.');
	hiresfilename = hiresfilename[hiresfilename.length - 2] + '@2x' + hiresfilename[hiresfilename.length - 1];
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, filename);
	var hiresfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, hiresfilename);
	if (file.exists()) {
		imageViewObject.image = file.nativePath;
	} else {
		var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName);
		if (!g.exists()) {
			g.createDirectory();
		};
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function() {
			if (xhr.status == 200) {
				file.write(xhr.responseData);
				if (hires ||imageViewObject.hires) {
					hiresfile.write(xhr.responseData);
					imageViewObject.hires = true;
				}	
				imageViewObject.image = file.nativePath;
			};
		};
		xhr.open('GET', url);
		xhr.send();
	};
};

var contacts = [{
	image : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'rainerappwerft.png').read(),
	URL : {
		"homepage" : ['http://webmasterei.com']
	},
	phone : {
		"work" : ['00494027806982']
	},
	email : {
		"work" : ['rainer@webmasterei-hamburg.de']
	},
	lastName : 'appWerft :: Dipl.-Ing. Rainer Schleevoigt, Hamburg',
	company :'appwerft Hamburg',
	kind : Ti.Contacts.CONTACTS_KIND_ORGANIZATION,
	address : {
		"work" : [{
			"Street" : 'Novalisweg 10',
			"City" : 'Hamburg',
			"Country" : 'Germany',
			"ZIP" : '22303'
		}]
	}

}];

ctrl.contactDialog = function() {
	var optionsDialogOpts = {
		options : ['Telefon', 'eMail', 'Kontakt speichern', 'QR-Code', 'Abbruch'],
		cancel : 4,
		title : 'Kontakt zur appWerft'
	};
	var dialog = Ti.UI.createOptionDialog(optionsDialogOpts);
	dialog.show();
	dialog.addEventListener('click', function(e) {
		switch(e.index) {
			case 0:
				Ti.Platform.openURL('tel:00494027806982');
				break;
			case 1:
				var email = Ti.UI.createEmailDialog({
					subject : "Info Request",
					toRecipients : ['rainer@webmasterei-hamburg.de'],
					messageBody : 'Your text here'
				});
				email.open();
				break;
			case 2:
				for(var i = 0; i < contacts.length; i++) {
					Ti.Contacts.createPerson(contacts[i]);
				}
			break;
			case 3:
				var TiBar = require('tibar');
				var options = {
					classType : "ZBarReaderViewController",
					sourceType : "Camera",
					cameraMode : "Sampling",
					config : {
						"showsCameraControls" : true,
						"showsZBarControls" : true,
						"tracksSymbols" : true,
						"showsHelpOnFail" : false,
						"takesPicture" : false
					},
					custom : {
						"scanCrop" : '',
						"CFG_X_DENSITY" : '',
						"CFG_Y_DENSITY" : '',
						"continuous" : ''
					},
					symbol : {
						"QR-Code" : true
					}
				};
				TiBar.scan({
					configure : options,
					success : function(data) {
						if(data && data.barcode) {
							var webwindow = Ti.UI.createWindow({navBarHidden:true});
							var webview = Ti.UI.createWebView({
								url : data.barcode,
								width:'100%',
								height:'100%'
							});
							webwindow.add(webview);
							tabGroup.activeTab.open(webwindow);
						}
					}
				});
			break;
		}
	});
};
