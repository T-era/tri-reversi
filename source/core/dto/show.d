module core.dto.show;

import std.concurrency : Tid;

import core.dto.common : Cell;
import core.game : GameInterface;
import core.rule.base : WIDTH, HEIGHT;

alias Cell[WIDTH][HEIGHT] Board; // 固定長だと、多次元配列の縦横が逆

struct ShowReq {}
struct ShowResp {
	Board board;
}

ShowResp show(Tid from, GameInterface game, ShowReq req) {
	ShowResp resp;
	game.show((Cell[][] cells) {
		for (int y = 0; y < HEIGHT; y ++) {
			for (int x = 0; x < WIDTH; x ++) {
				resp.board[y][x] = cells[y][x];
			}
		}
	});

	return resp;
}

unittest {
	int[2][1] ll;
	assert(ll.length == 1);
	assert(ll[0][1] == 0);
}
