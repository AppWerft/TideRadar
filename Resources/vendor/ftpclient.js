// change host, username and password options before running

var ftpConfig = {
	host:'ftp.example.com',
	port:21,
	user:'myUsername',
	password:'myPassword'
};

var win = Titanium.UI.createWindow({backgroundColor:'white'});

var connectButton = Titanium.UI.createButton({
	title:'Connect',
	top: 155,
	left:30,
	right:30,
	height:40
});
win.add(connectButton);

var controlSocket = Ti.Network.createTCPSocket({
	hostName:ftpConfig.host,
	port:ftpConfig.port,
	stripTerminator:true,
	mode:Titanium.Network.READ_WRITE_MODE
});

controlSocket.addEventListener('read', function(e) {
	Titanium.API.info('[SERVER] ' + e.data);
	responseCode = e.data.toString().substr(0,3);
	
	switch (responseCode) {
		case '220':	// server ready
			Titanium.API.info('[CLIENT] Logging in');
			controlSocket.write('USER ' + ftpConfig.user + '\n\r', e.from);		
			connectButton.title = 'Disconnect';
			break;
		
		case '221': // goodbye
			controlSocket.close();
			Titanium.API.info('Disconnected from ' + controlSocket.hostName);
			connectButton.title = 'Connect';
			break;
		
		case '230':	// user logged in
			Titanium.API.info('[CLIENT] Successfully logged in');
			break;
			
		case '331': // password required
			Titanium.API.info('[CLIENT] Sending password');
			controlSocket.write('PASS ' + ftpConfig.password + '\n\r', e.from);
			break;
		
		case '530': // login incorrect
			controlSocket.close();
			Titanium.API.info('Login failed, disconnected from ' + controlSocket.hostName);
			connectButton.title = 'Connect';
			break;
				
		default: 
			Titanium.API.info('Unhandled response: ' + responseCode);
			break;
	}
});

controlSocket.addEventListener('readError', function(e) {
	Titanium.API.info('Socket read error: ' + e.error);
});

controlSocket.addEventListener('writeError', function(e) {
	Titanium.API.info('Socket write error: ' + e.error);
});


connectButton.addEventListener('click', function(){
	if (connectButton.title == 'Connect') {
		try {
			Titanium.API.info('[CLIENT] Connecting to ' + controlSocket.hostName);
			controlSocket.connect();
		} catch (e) {
			Titanium.API.info('Error: ' + e.error);
		}					
	} else {
		if (controlSocket.isValid) {
			Titanium.API.info('[CLIENT] Quitting');
			controlSocket.write('QUIT\r\n');
		}
	}	
});

