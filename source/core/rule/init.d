module core.rule.init;

import vibe.vibe : logInfo;
import core.rule.base : WIDTH, HEIGHT;
import core.dto.common : Player, Cell, Position;

T[][] sized(T)(size_t width, size_t height, T init) {
	logInfo("Size: %d * %d", width, height);
	T[][] ret;
	ret.length = height;
	for (int y = 0; y < height; y ++) {
		ret[y] = [];
		ret[y].length = width;
		for (int x = 0; x < width; x ++) {
			ret[y][x] = init;
		}
	}

	return ret;
}

Cell[][] init(int width, int height) {
	Cell[][] field = sized!(Cell)(WIDTH, HEIGHT, Cell.None);

	field[5][8] = Cell.A;
	field[5][12] = Cell.A;
	field[3][10] = Cell.A;
	field[4][9] = Cell.B;
	field[6][11] = Cell.B;
	field[6][7] = Cell.B;
	field[4][11] = Cell.C;
	field[6][9] = Cell.C;
	field[6][13] = Cell.C;
	field[5][10] = Cell.AllMighty;
	return field;
}

unittest {
	import std.stdio;
	int[][] ll1 = sized!(int)(2,1, 1);
	writeln(ll1 == [[1], [1]]);
	int[][] ll2 = sized!(int)(1,2, 1);
	writeln(ll2 == [[1,1]]);
}
