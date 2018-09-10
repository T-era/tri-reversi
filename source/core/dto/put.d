module core.dto.hand_put;

import std.concurrency : Tid;

import core.dto.common : Player, Position;
import core.game : GameInterface;

struct HandPutReq {
	Player whom;
	Position to;
}
struct HandPutResp {
}

HandPutResp handPut(Tid from, GameInterface game, HandPutReq req) {
	game.aHandPut(
		req.whom,
		req.to);
	return HandPutResp();
}
