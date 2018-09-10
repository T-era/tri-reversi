module core.game;

import core.dto.common : Player, Cell, Position;

import core.rule.put : put;
import core.rule.init : init;
import core.rule.judge : canReverse;
import core.rule.base : isCenter, WIDTH, HEIGHT, ALL_MIGHTY_LIMIT;

alias void delegate(Player playerInTern) TurnChangeCallback;
alias void delegate(Player playerWin) GOverCallback;
alias void delegate(Cell[][] field) FieldShow;

interface GameInterface {
	void setCallbacks(TurnChangeCallback tcc, GOverCallback goc);
	Player getInTern();
	void show(FieldShow callback);
	void aHandPut(Player player, Position to);
}

class Game : GameInterface {
	private Cell[][] field;
	private Player inTurn;
	private int turnNow;
	private TurnChangeCallback tcc;
	private GOverCallback goc;

	this() {
		field = init(WIDTH, HEIGHT);
		inTurn = Player.A;
		turnNow = 0;
	}

	void setCallbacks(TurnChangeCallback tcc, GOverCallback goc) {
		this.tcc = tcc;
		this.goc = goc;
	}
	Player getInTern() {
		return inTurn;
	}
	void show(FieldShow callback) {
		callback(field);
	}
	void aHandPut(Player player, Position to) {
		if (player != inTurn) {
			throw new Exception("Not your turn!");
		} else if (isCenter(to.x, to.y)) {
			throw new Exception("Can't put to center!");
		} else if (field[to.y][to.x] != Cell.None) {
			throw new Exception("Cant't put on another stone!");
		} else {
			if (canReverse(turnNow, this.field, to, player)) {
				put(turnNow, this.field, to, player);
				next();
			} else {
				throw new Exception("Put as effective!");
			}
		}
	}
	private void next() {
		final switch (inTurn) {
			case Player.A:
				inTurn = Player.B;
				break;
			case Player.B:
				inTurn = Player.C;
				break;
			case Player.C:
				inTurn = Player.A;
				turnNow ++;
				if (turnNow >= ALL_MIGHTY_LIMIT) {
					field[5][10] = Cell.Nothing;
				}
				break;
		}
	}
}
