module core.internal.entry;

import vibe.vibe : WebSocket, parseJsonString, msecs;
import vibe.vibe : logInfo;

import core.matching : Matcher;
import core.loop : LoopStatus;
import std.string : format;

struct EntryResp {
	LoopStatus status;
	string uid;
}
EntryResp entry(scope WebSocket socket, Matcher matchingSrv, string uid) {
	if (socket.waitForData(100.msecs)) {
		auto request = parseJsonString(socket.receiveText());
		if (request["class"] == "entry") {
			string name = request["name"].to!string;

			matchingSrv.entry(name, uid);
			return EntryResp(LoopStatus.Success, uid);
		} else {
			throw new Exception(format("Unexpected request: %s", request));
		}
	}
	return EntryResp(LoopStatus.OnWaiting);
}

EntryResp entrySuspended() { return EntryResp(LoopStatus.Failed); }
