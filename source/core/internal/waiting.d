module core.internal.waiting;

import vibe.vibe : WebSocket, Json, parseJsonString, msecs;
import vibe.vibe : logInfo;

import std.concurrency : Tid, receiveTimeout;
import std.string : format;
import std.conv : to;

import core.dto.common : Player;
import core.matching : Matcher, Trio;
import core.loop : LoopStatus;

struct WaitingResp {
	LoopStatus status;
	Tid gsTid;
	Player assign;
}

WaitingResp waiting(scope WebSocket socket, Matcher waitingSrv, string uid) {
	bool received = false;

	// listen paired
	Tid gsTid;
	Player assign;
	receiveTimeout(0.msecs,
		(Tid tid, Trio trio) {
			socket.send(Json([
				"class": Json("match"),
				"gid": Json(trio.gid),
				"nameA": Json(trio.nameA),
				"nameB": Json(trio.nameB),
				"nameC": Json(trio.nameC),
				"assign": Json(to!string(trio.assign)),
			]).to!string);
			gsTid = tid;
			assign = trio.assign;
			received = true;
		});
	if (received) {
		return WaitingResp(LoopStatus.Success, gsTid, assign);
	}

	// listen retire-call
	if (socket.waitForData(100.msecs)) {
		auto request = parseJsonString(socket.receiveText());
		if (request["class"] == "retire") {
			waitingSrv.retire(uid);
			return WaitingResp(LoopStatus.Failed);
		} else {
			throw new Exception(format("Unexpected request: %s", request));
		}
	}
	return WaitingResp(LoopStatus.OnWaiting);
}

auto waitingDisconnected(Matcher waitingSrv, string uid) {
	return () {
		waitingSrv.retire(uid);
		return WaitingResp(LoopStatus.Failed);
	};
}
