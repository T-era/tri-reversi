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
        this.gameDiv = _gDiv;
        this.board = new GameBoard();

        api.initWs({
            onOpen: this.openEntryDialog.bind(this),
            onMatch: function() {
                startGame.apply(null, arguments);
                _gDiv.setAttribute('class', 'show');
            },
            showCallback: function(showResp) {
                console.log(arguments);
                this.board.showCells(showResp.board);
            }.bind(this)
        });

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
                // if (getColorClass(pos.x, pos.y) == blankCellClass) {
                //     setColor(pos.x, pos.y, nowWho.inTurn);
                //     var rev = revAll(pos.x, pos.y);
                //     if (! rev) {
                //         setColorClass(pos.x, pos.y, blankCellClass);
                //     } else {
                //         nowWho.next();
                //         scoreBoard.showScores();
                //     }
                // }
            }
        }
    }

    showCells(board) {
        console.log(board);
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
/*    let nowWho;
    let scoreBoard;
    let c = 0;
    let strict = false;
    let turns = 0;

    const lineClass = 'grid_line';
    const blankCellClass = 'none';
    const blockedCellClass = 'blocked';
    const triClasses = ['a', 'b', 'c'];
    let centerCellClass = 'am';

    function init() {
        const svgBase = document.getElementById('svg_base');
        const backGrid = document.getElementById('backgrid');
        const setting = {
            width: 880,
            height: 780,
            size: 5
        };
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
        }

        function showCells() {
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
            setColor(10, 5, 99);
            setColor(8, 5, 0);
            setColor(12, 5, 0);
            setColor(10, 3, 0);
            setColor(9, 4, 1);
            setColor(11, 6, 1);
            setColor(7, 6, 1);
            setColor(11, 4, 2);
            setColor(9, 6, 2);
            setColor(13, 6, 2);
        }
        class NowWho {
            constructor() {
                this.inTurn = 0;
                this.dom = document.getElementById('nowwho');
                this.show();
            }
            next() {
                this.inTurn = (this.inTurn + 1) % 3;
                this.show();
                if (this.inTurn == 0) {
                    turns ++;
                    if (turns == turnsAllMighty) {
                        setColorClass(10,5,blockedCellClass);
                    }
                }
            }
            show() {
                var abc = triClasses[this.inTurn];
                this.dom.setAttribute("class", abc)
            }
        }

        initGrid();
        initCells();
        nowWho = new NowWho();
        scoreBoard = new ScoreBoard();
        document.getElementById('btn_pass').onclick = passEvent;

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
    function svgCell(x, y, cssClass, pos) {
        let ret = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        ret.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#cell');
        ret.setAttribute('transform', `translate(${x},${y})`);
        ret.setAttribute("class", cssClass);
        ret.onclick = cellClickEvent(pos);
        return ret;
    }
    function cellClickEvent(pos) {
        return function() {
            if (getColorClass(pos.x, pos.y) == blankCellClass) {
                setColor(pos.x, pos.y, nowWho.inTurn);
                var rev = revAll(pos.x, pos.y);
                if (! rev) {
                    setColorClass(pos.x, pos.y, blankCellClass);
                } else {
                    nowWho.next();
                    scoreBoard.showScores();
                }
            }
        }
    }
    function passEvent() {
        nowWho.next();
    }
    function revAll(x, y) {
        let myColorClass = getColorClass(x, y);
        let ret = false;
        ret = revIf({dx: -2, dy: 0}) || ret;
        ret = revIf({dx: -1, dy: -1}) || ret;
        ret = revIf({dx: -1, dy: 1}) || ret;
        ret = revIf({dx: 1, dy: -1}) || ret;
        ret = revIf({dx: 2, dy: 0}) || ret;
        ret = revIf({dx: 1, dy: 1}) || ret;
        return ret;

        function revIf(d) {
            let [tx, ty] = [x + d.dx, y + d.dy];
            let ret = false;

            let bColor = getColorClass2(tx, ty);
            if (bColor == blankCellClass
                || bColor == myColorClass
                || bColor == centerCellClass) {
                return false;
            } else {
                let [nextTx, nextTy] = [tx + d.dx, ty + d.dy];
                if (seek(nextTx, nextTy)) {
                    reverse(tx, ty);
                    ret = true;
                }
                return ret;
            }
            function seek(nx, ny) {
                let cColor = getColorClass2(nx, ny);
                if (cColor == blankCellClass || cColor == blockedCellClass) {
                    return false;
                } else if (cColor == myColorClass || cColor == centerCellClass) {
                    return true;
                } else if (cColor == bColor || ! strict) {
                    return seek(nx + d.dx, ny + d.dy);
                } else {
                    return false;
                }
            }
            function reverse(nx, ny) {
                let [tx, ty] = [nx, ny];
                while (true) {
                    let theColor = getColorClass(tx, ty);
                    if (myColorClass == theColor || theColor == centerCellClass) {
                        return;
                    }
                    setColorClass(tx, ty, myColorClass);
                    tx += d.dx;
                    ty += d.dy;
                }
            }
        }
    }
    class ScoreBoard {
        constructor() {
            this.showScores();
        }
        showScores() {
            let [a, b, c] = [0, 0, 0];
            for (var y = 0, yMax = cells.length; y < yMax; y ++) {
                let line = cells[y];
                for (var x = 0, xMax = line.length; x < xMax; x ++) {
                    let classAt = getColorClass2(x, y);
                    if (classAt == 'a') {
                        a ++;
                    } else if (classAt == 'b') {
                        b ++;
                    } else if (classAt == 'c') {
                        c ++;
                    }
                }
            }
            showScore('a', a);
            showScore('b', b);
            showScore('c', c);
            function showScore(id, score) {
                let w = score * 2;
                document.getElementById(`bar_${id}`).setAttribute('width',  w);
                document.getElementById(`score_${id}`).textContent = score;
            }
        }
    }

    function setColor(x, y, colIndex) {
        var abc = colIndex < 3 ? triClasses[colIndex] : centerCellClass;
        setColorClass(x, y, abc);
    }
    function setColorClass(x, y, abc) {
        cells[y][x].setAttribute('class', abc)
    }
    function getColorClass2(x, y) {
        if (x < 0 || y < 0
            || y >= cells.length
            || x >= cells[y].length
            || ! cells[y][x]) {
            return blankCellClass;
        } else {
            return getColorClass(x, y);
        }
    }
    function getColorClass(x, y) {
        return cells[y][x].getAttribute('class');
    }
})();
*/
