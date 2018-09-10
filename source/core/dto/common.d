module core.dto.common;

enum Player : int {
	A = 1,
	B = 2,
	C = 4 };

enum Cell : int {
	None = 0,
	A = 1,
	B = 2,
	C = 4,
	AllMighty = 7,
	Nothing = -1 };

struct ShuttingDown {}
struct Finished {}

struct Position {
	int x;
	int y;

	bool opEquals(Position arg) {
		return this.x == arg.x
				&& this.y == arg.y;
	}
}
