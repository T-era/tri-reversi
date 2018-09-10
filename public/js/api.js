
var api = new (function() {
	let socket;
	let gid;
	let listener;
	// listener: {
	// 	onOpen
	// 	onMatch
	// 	showCallback
	//  turnChangedCallback
	// }
	this.initWs = function(_listener) {
		var baseUrl = getBaseURL();
		socket = new WebSocket(baseUrl + "/tr");
		listener = _listener;

		socket.onclose = function() {
			console.log("Connection closed.");
		};
		socket.onerror = function() {
			console.log("Error!");
		};
		socket.onmessage = handleError(function(msgJson) {
			console.log(msgJson);
			let gid = msgJson.gid;
			let nameA = msgJson.nameA;
			let nameB = msgJson.nameB;
			let nameC = msgJson.nameC;
			let assigned = msgJson.assign;

			goonQs(gid, socket);

			listener.onMatch(assigned, nameA, nameB, nameC);
		});
		socket.onopen = function() {
			listener.onOpen();
		};
	};
	this.closeConnection = function() {
		socket.close();
	}
	this.entry = function(name) {
		socket.send(JSON.stringify({
				class: 'entry',
				name: name
			}));
	};

	this.show = function() {
		socket.send(JSON.stringify({
			gid: gid,
			class: 'show'
		}));
	}
	this.put = function(x, y) {
		socket.send(JSON.stringify({
			class: 'put',
			to: {
				x: x,
				y: y
			}
		}));
	};
	this.pass = function() {
		socket.send(JSON.stringify({
			class: 'pass'
		}));
	};


	function goonQs(gid, socket) {
		console.log("started");
		socket.onmessage = handleError(function(msgJson) {
			var cls = msgJson['class'];
			if (cls === 'turn') {
				console.log("Turn changed", msgJson);
				listener.turnChangedCallback(msgJson['your'], msgJson['nowOn']);
				api.show();
			} else if (cls === 'result') {
				uitools.showMessage(msgJson.win ? 'You win!' : 'You Lose');
			} else if (cls === 'error') {
				alert(msgJson['message']);
				//control.errorCallback(msgJson['message']);
			} else if (cls === 'show'){
				listener.showCallback(msgJson);
			} else if (cls === 'retired') {
				alert(msgJson['message']);
//				uitools.showMessage(msgJson['message']);
			} else if (cls === 'put') {
				// put then redraw.
				api.show();
			}
		});
	}

	function handleError(f) {
		return function(message) {
			var msgJson = JSON.parse(message.data);
			if (msgJson['error']) {
				alert(msgJson['error']);
			} else {
				return f(msgJson);
			}
		}
	}

	function getBaseURL() {
		var url = window.location.href;
		var schemeLen = url.indexOf(":");
		var href = url.substring(schemeLen + 3); // strip "http://" or "https://"
		var idx = href.indexOf("/");
		return "ws://" + href.substring(0, idx);
	}
})();
