module core.dto.pass;

import std.concurrency : Tid;

import core.dto.common : Player, Position;
import core.game : GameInterface;

struct PassReq {
	Player whom;
}
struct PassResp {
}

PassResp pass(Tid from, GameInterface game, PassReq req) {
	game.pass(req.whom);
	return PassResp();
}
