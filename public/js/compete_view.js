const lineClass = 'grid_line';
const setting = {
	width: 880,
	height: 780,
	size: 5
};
const blankCellClass = 'none';
const blockedCellClass = 'blocked';

class CompeteView {
	constructor(startGame) {
		this.entryDialog = document.getElementById('entry_dialog');
		let _gDiv = document.getElementById('game');
		let _progress = new ProgressBar();
		this.gameDiv = _gDiv;
		this.board = new GameBoard();
		this.scoreBoard = new ScoreBoard();

		api.initWs({
			onOpen: this.openEntryDialog.bind(this),
			onMatch: function(assigned, nameA, nameB, nameC) {
				startGame.apply(null, arguments);
				_gDiv.setAttribute('class', 'show');
			},
			showCallback: function(showResp) {
				console.log(arguments);
				this.board.showCells(showResp.board);
				this.scoreBoard.scoreChanged(showResp.scores);
			}.bind(this),
			turnChangedCallback: function(yourOrNot, waitingFor) {
				_progress.switchTurn(yourOrNot, waitingFor);
			}
		});
		document.getElementById('btn_pass').onclick = function() {
			api.pass();
		}
	}

	openEntryDialog() {
		this.entryDialog.setAttribute('class', 'show');
		this.gameDiv.setAttribute('class', '');
	}
	onCloseButtonClicked() {
		this.entryDialog.setAttribute('class', '');
	}
	onEntryButtonClicked() {
		api.entry(document.getElementById('name').value);
		this.entryDialog.setAttribute('class', '');
	}
	showScores(scores) {
	}
}

class GameBoard {
	constructor() {
		const svgBase = document.getElementById('svg_base');
		const backGrid = document.getElementById('backgrid');
		initGrid();
		this.cells = initCells();

		function initGrid() {
			backGrid.appendChild(svgLine(40, 390, 840, 390, lineClass));
			backGrid.appendChild(svgLine(640, 40, 240, 740, lineClass));
			backGrid.appendChild(svgLine(240, 40, 640, 740, lineClass));
			for (var i = 1; i <= setting.size; i ++) {
				backGrid.appendChild(svgLine(40 + 40 * i, 390 + 70 * i, 840 - 40 * i, 390 + 70 * i, lineClass));
				backGrid.appendChild(svgLine(40 + 40 * i, 390 - 70 * i, 840 - 40 * i, 390 - 70 * i, lineClass));
				backGrid.appendChild(svgLine(640 + 40 * i, 40 + 70 * i, 240 + 80 * i, 740, lineClass));
				backGrid.appendChild(svgLine(640 - 80 * i, 40, 240 - 40 * i, 740 - 70 * i, lineClass));
				backGrid.appendChild(svgLine(240 - 40 * i, 40 + 70 * i, 640 - 80 * i, 740, lineClass));
				backGrid.appendChild(svgLine(240 + 80 * i, 40, 640 + 40 * i, 740 - 70 * i, lineClass));
			}

			function svgLine(x1, y1, x2, y2, cssClass) {
				let ret = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				ret.setAttribute("x1", x1);
				ret.setAttribute("y1", y1);
				ret.setAttribute("x2", x2);
				ret.setAttribute("y2", y2);
				ret.setAttribute("class", cssClass);
				return ret;
			}
		}
		function initCells() {
			let cells = [];
			let yMax = setting.size * 2 + 1;
			let center = setting.size;
			for (var y = 0; y < yMax; y ++) {
				let start = Math.abs(center - y);
				let width = yMax - start;
				let line = [];
				line.length = 4 * center;
				for (var xx = 0; xx < width * 2; xx += 2) {
					let x = xx + start;
					let cell = svgCell(40 + x * 40, 35 + y * 70, blankCellClass, {x:x, y:y});
					svgBase.appendChild(cell);
					line[x] = cell;
				}
				cells.push(line);
			}
			return cells;

			function svgCell(x, y, cssClass, pos) {
				let ret = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				ret.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#cell');
				ret.setAttribute('transform', `translate(${x},${y})`);
				ret.setAttribute("class", cssClass);
				ret.onclick = cellClickEvent(pos);
				return ret;
			}
		}
		function cellClickEvent(pos) {
			return function() {
				api.put(pos.x, pos.y);
			}
		}
	}

	showCells(board) {
		for (let y = 0, yMax = board.length; y < yMax; y ++) {
			let line = board[y];
			for (let x = 0, xMax = line.length; x < xMax; x ++) {
				if (this.cells[y][x]) {
					let index = line[x];
					let cc = index == 0 ? 'none'
							: index == 1 ? 'a'
							: index == 2 ? 'b'
							: index == 4 ? 'c'
							: index == 7 ? 'am'
							: '';
					this.cells[y][x].setAttribute('class', cc);
				}
			}
		}
	}
}
class ProgressBar {
	constructor() {
		this.progressView = document.getElementById('who_progress');
		this.whoView = document.getElementById('who');
	}

	switchTurn(yourOrNot, waitingFor) {
		this.progressView.setAttribute('class', yourOrNot ? 'hide' : '');
		this.whoView.setAttribute('class', waitingFor.toLowerCase());

	}
}
class ScoreBoard {
	constructor() {
		this.scoreA = document.getElementById('bar_a')
		this.scoreB = document.getElementById('bar_b')
		this.scoreC = document.getElementById('bar_c')
		this.scoreAView = document.getElementById('score_a');
		this.scoreBView = document.getElementById('score_b');
		this.scoreCView = document.getElementById('score_c');
	}
	scoreChanged(scores) {
		this.scoreAView.textContent = scores[0];
		this.scoreBView.textContent = scores[1];
		this.scoreCView.textContent = scores[2];
		this.scoreA.setAttribute('width', scores[0] * 2);
		this.scoreB.setAttribute('width', scores[1] * 2);
		this.scoreC.setAttribute('width', scores[2] * 2);
	}
}
