module core.dto.show;

import std.concurrency : Tid;

import core.dto.common : Cell;
import core.game : GameInterface;
import core.rule.base : WIDTH, HEIGHT;

alias Cell[WIDTH][HEIGHT] Board; // 固定長だと、多次元配列の縦横が逆
alias int[3] Scores;

struct ShowReq {}
struct ShowResp {
	Board board;
	Scores scores;
}

ShowResp show(Tid from, GameInterface game, ShowReq req) {
	ShowResp resp;
	game.show((Cell[][] cells) {
		for (int y = 0; y < HEIGHT; y ++) {
			for (int x = 0; x < WIDTH; x ++) {
				Cell atHere = cells[y][x];
				resp.board[y][x] = atHere;
				switch (atHere) {
				case Cell.A:
					resp.scores[0] ++;
					break;
				case Cell.B:
					resp.scores[1] ++;
					break;
				case Cell.C:
					resp.scores[2] ++;
					break;
				default:
					break;
				}
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
