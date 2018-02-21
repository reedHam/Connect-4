// Board constructor
var Board = function (cols, rows){
    var board = [];
    var group = game.add.group();

    for (let y = 0; y < rows; y++){
        var row = [];

        for (let x = 0; x < cols; x++){
            var tile = new Tile(x, y, group);
            row.push(tile);
        }

        board.push(row);
    }

    this.moveTo = function(x, y){
        group.x = x;
        group.y = y;
    }

    this.getTile = function(x, y){
        return board[y][x];
    }

    // Changes the winning sprites to green and disables game board
    this.displayWin = function(x, y, chain){
        let winnerGroup = game.add.group();
        board[y][x].winTween();
        //group.swap(group.children[x + (gameProperties.boardWidth * y)], group.children[group.children.length-1]);
        
        for (let i = 0, ln = gameProperties.winningChainLength - 1; i <= ln; i++){
            if (chain == states.winStates.up){
                board[y - i][x].winTween();
            } else if (chain == states.winStates.down){
                board[y + i][x].winTween();
            } else if (chain == states.winStates.left){
                board[y][x - i].winTween();
            } else if (chain == states.winStates.right){
                board[y][x + i].winTween();
            } else if (chain == states.winStates.upRight){
                board[y - i][x - i].winTween();
            } else if (chain == states.winStates.upLeft){
                board[y - i][x + i].winTween();
            } else if (chain == states.winStates.downLeft){
                board[y + i][x - i].winTween();
            } else if (chain == states.winStates.downRight){
                board[y + i][x + i].winTween();
            } else {
                throw "ERROR DISPLAYING WIN: DEFAULT STATE REACHED";
            }
        }

        for (let y = 0; y < rows; y++){
            for (let x = 0; x < cols; x++){
                board[y][x].disableInput();
                board[y][x].resetHighlight();
            }
        }
    }
}