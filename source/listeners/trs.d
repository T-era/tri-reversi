/// TR用のWebSocketリスナ
module listeners.trs;

import std.uuid : randomUUID;
import vibe.vibe : WebSocket, logError, Json;
import std.concurrency : Tid;

import core.dto.common : Player;
import core.matching : Matcher;
import core.internal.entry : entry, EntryResp, entrySuspended;
import core.internal.gaming : GResp, gaming, gamingDisconnected;
import core.internal.waiting : waiting, WaitingResp, waitingDisconnected;
import core.loop : LoopStatus;

R onWsGoing(R, T...)(R function(scope WebSocket socket, T args) f, R delegate() disconnected, scope WebSocket socket, T args) {
	try {
		R resp;
		for (bool running = true; socket.connected && running; ) {
			resp = f(socket, args);
			running = (resp.status == LoopStatus.OnWaiting);
		}
		if (! socket.connected) {
			return disconnected();
		}
		return resp;
	} catch(Exception ex) {
		logError("Error %s", ex);
		socket.send(Json([
			"error": Json(ex.msg)
		]).to!string);
		throw ex;
	}
}
auto trsListener(Matcher waitingSrv) {
	return (scope WebSocket socket) {
		string uid = randomUUID().toString;

		EntryResp er = onWsGoing!(EntryResp, Matcher, string)
				(&entry, () { return entrySuspended(); }, socket, waitingSrv, uid);
		if (er.status == LoopStatus.Failed) {
			return;
		}
		WaitingResp wr = onWsGoing!(WaitingResp, Matcher, string)
				(&waiting, waitingDisconnected(waitingSrv, uid), socket, waitingSrv, uid);
		if (wr.status == LoopStatus.Failed) {
			return;
		}
		GResp gr = onWsGoing!(GResp, Tid, string, Player)
				(&gaming, gamingDisconnected(wr.gsTid), socket, wr.gsTid, uid, wr.assign);
	};
}
