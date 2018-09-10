module core.rule.judge;

import core.dto.common : Player, Cell, Position;
import core.rule.base : isAllMighty, isCenter, getCell;

import std.conv : to;

bool canReverse(int turn, Cell[][] field, Position to, Player player) {
	return canReverseTo(turn, field, to, player, -2, 0)
		|| canReverseTo(turn, field, to, player, -1, -1)
		|| canReverseTo(turn, field, to, player, -1, 1)
		|| canReverseTo(turn, field, to, player, 1, -1)
		|| canReverseTo(turn, field, to, player, 1, 1)
		|| canReverseTo(turn, field, to, player, 2, 0);
}

bool canReverseTo(int turn, Cell[][] field, Position pos, Player player, int dx, int dy) {
	bool seek(int nx, int ny) {
		Cell cCell = field.getCell(nx, ny);
		if (cCell == Cell.None
			|| (isCenter(nx, ny) && ! isAllMighty(turn, nx, ny))) {
			return false;
		} else if (to!(int)(cCell) == to!(int)(player)
			|| isAllMighty(turn, nx, ny)) {
			return true;
		} else {
			return seek(nx + dx, ny + dy);
		}
	}
	int tx = pos.x + dx;
	int ty = pos.y + dy;
	bool ret = false;

	Cell toCell = field.getCell(tx, ty);
	if (toCell == Cell.None
		|| to!(int)(toCell) == to!(int)(player)) {
		return false;
	} else {
		return seek(tx + dx, ty + dy);
	}
}
