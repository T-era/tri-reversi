
var api = new (function() {
	let socket;
	let gid;
	let listener;
	// listener: {
	// 	onOpen
	// 	onMatch
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
			var gid = msgJson.gid;
			var nameA = msgJson.nameA;
			var nameB = msgJson.nameB;
			var nameC = msgJson.nameC;

			goonQs(gid, socket);

			listener.onMatch(nameA, nameB, nameC);
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
	this.put = function(id, x, y) {
		socket.send(JSON.stringify({
			class: 'put',
			indexInHand: index,
			to: {
				x: x,
				y: y
			}
		}));
	};
	this.timer = function() {
		socket.send(JSON.stringify({
			class: 'time'
		}));
	}


	function goonQs(gid, socket) {
		console.log("started");
		socket.onmessage = handleError(function(msgJson) {
			var cls = msgJson['class'];
			if (cls === 'your_turn') {
				api.show();
			} else if (cls === 'reface') {
				var answer = uitools.showConfirm('Reface ?',
					refaceConfirmThen(true),
					refaceConfirmThen(false));
				function refaceConfirmThen(answer) {
					return function() {
						socket.send(JSON.stringify({
							class: 'reface',
							answer: answer
						}));
					}
				}
			} else if (cls === 'time') {
				timer.callback(msgJson);
			} else if (cls === 'result') {
				uitools.showMessage(msgJson.win ? 'You win!' : 'You Lose');
			} else if (cls === 'error') {
				control.errorCallback(msgJson['message']);
			} else if (cls === 'show'){
				listener.showCallback(msgJson);
			} else if (cls === 'retired') {
				uitools.showMessage(msgJson['message']);
			} else {
				api.show();
				console.log(msgJson);
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
