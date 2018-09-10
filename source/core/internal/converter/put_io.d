module core.internal.converter.put_io;

import vibe.vibe : Json;
import std.conv : to;

import core.dto.common : Position, Player;
import core.dto.hand_put : handPut, HandPutReq, HandPutResp;

HandPutReq toHandPutReq(Player nowWho, Json json) {
	return HandPutReq(
		nowWho,
		Position(
			json["to"]["x"].to!int,
			json["to"]["y"].to!int));
}

Json fromHandPutResp(HandPutResp hpr) {
	return Json([
		"class": Json("put")
	]);
}
