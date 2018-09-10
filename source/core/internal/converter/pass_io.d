module core.internal.converter.pass_io;

import vibe.vibe : Json;
import std.conv : to;

import core.dto.common : Player;
import core.dto.pass : pass, PassReq, PassResp;

PassReq toPassReq(Player nowWho) {
	return PassReq(nowWho);
}

Json fromPassResp(PassResp pr) {
	return Json([
		"class": Json("pass")
	]);
}
