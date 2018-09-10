module core.rule.put;

import core.dto.common : Player, Cell, Position;
import core.rule.judge : canReverse;
import core.rule.base : fromPlayer, isCenter, isAllMighty, getCell;
import core.rule.judge : canReverseTo;

void put(int turn, Cell[][] field, Position pos, Player player) {
	Cell cellA = fromPlayer(player);
	field[pos.y][pos.x] = cellA;

	void reverseIf(int dx, int dy) {
		if (canReverseTo(turn, field, pos, player, dx, dy)) {
			int tx = pos.x + dx;
			int ty = pos.y + dy;
			while(true) {
				Cell cellB = getCell(field, tx, ty);
				if (cellB == cellA
					|| isAllMighty(turn, tx, ty)) {
					return;
				} else {
					field[ty][tx] = cellA;
				}
				tx += dx;
				ty += dy;
			}
		}
	}
	reverseIf(-2, 0);
	reverseIf(-1, -1);
	reverseIf(-1, 1);
	reverseIf(1, -1);
	reverseIf(1, 1);
	reverseIf(2, 0);
}
