/// コアスレッド
module core.game_srv;

import std.concurrency : send, receive, Tid, thisTid;
import vibe.vibe : logInfo, logError;

import core.dto.common : Player, Finished, ShuttingDown;
import core.game : GameInterface, Game;
import core.dto.show : show, ShowReq, ShowResp;
import core.dto.hand_put : handPut, HandPutReq, HandPutResp;
import core.dto.pass : pass, PassReq, PassResp;

struct Turn {
	bool your;
	Player nowOn;
}
struct ErrorResp {
	string message;
}
struct GRetire{}
struct GOver {
	Player winner;
}

void gServer(Tid tid1, Tid tid2, Tid tid3, Tid owner) {
	logInfo("Server thread started.");

	GameInterface server = new Game();
	bool running = true;

	server.setCallbacks(
		(Player side) {
			send(tid1, Turn(side == Player.A, side));
			send(tid2, Turn(side == Player.B, side));
			send(tid3, Turn(side == Player.C, side));
		},
		(Player sideWin) {
			send(tid1, GOver(sideWin));
			send(tid2, GOver(sideWin));
			send(tid3, GOver(sideWin));
			running = false;
		});

	logInfo("Starting...");
	for (; running; ) {
		logInfo("running...");
		receive(
			(ShuttingDown _) {
				running = false;
			},
			(Tid from, GRetire r) {
				running = false;
				foreach (tid; [tid1, tid2]) {
					if (tid != from) {
						send(tid, GRetire());
					}
				}
				send(owner, r);
			},
			asFunc!(ShowResp, ShowReq)(server, &show),
			asFunc!(HandPutResp, HandPutReq)(server, &handPut),
			asFunc!(PassResp, PassReq)(server, &pass));
	}
	logInfo("Server thread finished normally.");
}

// 関数のIN/OUTを、スレッド間の応答に置き換えます。
// 関数の戻り値は、コール元のスレッドに送り返します。
void delegate(Tid, T) asFunc(R, T)(GameInterface server, R function(Tid, GameInterface, T) f) {
	return (Tid from, T args) {
		try {
			logInfo("In asFunc");
			R resp = f(from, server, args);
			logInfo("In asFunc ", resp);
			send(from, resp);
		} catch (Exception ex) {
			logError("Error?", ex);
			send(from, ErrorResp(ex.msg));
		}
	};
}
