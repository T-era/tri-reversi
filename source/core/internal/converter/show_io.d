module core.internal.converter.show_io;

import std.algorithm;
import std.array;
import vibe.vibe : Json;

import core.dto.show : ShowResp, Board;
import core.rule.init : WIDTH, HEIGHT;

Json fromShowResp(ShowResp sr) {
	return Json([
		"class": Json("show"),
		"board": fromBoard(sr.board),
	]);
}

Json fromBoard(Board board) {
	Json ret = Json.emptyArray;
	foreach (y; 0..HEIGHT) {
		ret ~= [Json.emptyArray];
		foreach (x; 0..WIDTH) {
			ret[y] ~= [Json.emptyArray];
			ret[y][x] = board[y][x];
		}
	}
	return ret;
}
