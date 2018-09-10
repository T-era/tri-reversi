module core.rule.base;

import std.conv : to;

import core.dto.common : Cell, Player;

const int WIDTH = 21;
const int HEIGHT = 11;
const int ALL_MIGHTY_LIMIT = 3;

bool isCenter(int x, int y) {
	return x == WIDTH / 2
		&& y == HEIGHT / 2;
}

unittest {
	assert(! isCenter(0,0));
	assert(isCenter(5, 10));
	assert(! isCenter(6, 10));
	assert(! isCenter(5, 9));
}

bool isAllMighty(int turn, int x, int y) {
	return isCenter(x, y)
		&& turn < ALL_MIGHTY_LIMIT;
}

Cell getCell(Cell[][] field, int x, int y) {
	if (x < 0 || y < 0
		|| y >= field.length || x >= field[y].length) {
		return Cell.None;
	} else {
		return field[y][x];
	}
}

Cell fromPlayer(Player p) {
	return to!Cell(to!int(p));
}
