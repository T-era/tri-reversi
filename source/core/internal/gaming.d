module core.internal.gaming;

import vibe.vibe : WebSocket, Json, logInfo, logError, parseJsonString, msecs;
import std.concurrency : Tid, receiveTimeout, send, thisTid;
import std.string : format;
import std.conv : to;

import core.loop : LoopStatus;
import core.game_srv : GOver, Turn, GRetire, ErrorResp;
import core.dto.common : Player;
import core.dto.hand_put : HandPutResp;
import core.dto.pass : PassResp;
import core.dto.show : ShowReq, ShowResp;
import core.internal.converter.show_io : fromShowResp;
import core.internal.converter.put_io : fromHandPutResp, toHandPutReq;
import core.internal.converter.pass_io : fromPassResp, toPassReq;

struct GResp {
	LoopStatus status;
}

GResp gaming(scope WebSocket socket, Tid gTid, string uid, Player player) {
	bool finished = false;

	receiveTimeout(0.msecs,
		(GOver go) {
			socket.send(Json([
				"class": Json("result"),
				"win": Json(to!int(go.winner))
			]).to!string);
			finished = true;
		},
		(Turn t) {
			logInfo("send Turn");
			socket.send(Json([
				"class": Json("turn"),
				"your": Json(t.your),
				"nowOn": Json(to!string(t.nowOn))
			]).to!string);
		},
		(GRetire r) {
			logError("Ritire");
			socket.send(Json([
				"class": Json("retired"),
				"message": Json("Partner is gone away..."),
			]).to!string);
			finished = true;
		},
		(ErrorResp e) {
			logError("Error %s", e);
			socket.send(Json([
				"class": Json("error"),
				"message": Json(e.message)
			]).to!string);
		},
		(ShowResp sr) {
			logInfo("Show response");

			socket.send(sr.fromShowResp().to!string);
		},
		(HandPutResp hpr) {
			logInfo("HandPut response");

			socket.send(hpr.fromHandPutResp().to!string);
		},
		(PassResp pr) {
			socket.send(pr.fromPassResp().to!string);
		});

	if (finished) {
		logInfo("Finished:", gTid);
		return GResp(LoopStatus.Success);
	}

	if (socket.waitForData(100.msecs)) {
		auto request = parseJsonString(socket.receiveText());
		switch (request["class"].to!string) {
			case "show":
				logInfo(format("Show request, %s %s", gTid, thisTid));
				send(gTid, thisTid, ShowReq());
				break;
			case "put":
				logInfo(format("Put request %s", request));
				send(gTid, thisTid, toHandPutReq(player, request));
				break;
			case "pass":
				logInfo("Passed");
				send(gTid, thisTid, toPassReq(player));
				break;
			default:
				throw new Exception(format("Unknown class: %s", request));
		}
	}
	return GResp(LoopStatus.OnWaiting);
}

auto gamingDisconnected(Tid gTid) {
	return () {
		send(gTid, thisTid, GRetire());
		return GResp(LoopStatus.Failed);
	};
}
