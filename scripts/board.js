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

    this.displayWin = function(x, y, chain){
        board[y][x].setState(states.tileStates.WINNER);
        board[y][x].updateSprite();
        for (let i = 0, ln = gameProperties.winningChainLength - 1; i <= ln; i++){
            if (chain == states.winStates.up){
                board[y - i][x].setState(states.tileStates.WINNER);
                board[y - i][x].updateSprite();
            } else if (chain == states.winStates.down){
                board[y + i][x].setState(states.tileStates.WINNER);
                board[y + i][x].updateSprite();
            } else if (chain == states.winStates.left){
                board[y][x - i].setState(states.tileStates.WINNER);
                board[y][x - i].updateSprite();
            } else if (chain == states.winStates.right){
                board[y][x + i].setState(states.tileStates.WINNER);
                board[y][x + i].updateSprite();
            } else if (chain == states.winStates.upRight){
                board[y - i][x - i].setState(states.tileStates.WINNER);
                board[y - i][x - i].updateSprite();
            } else if (chain == states.winStates.upLeft){
                board[y - i][x + i].setState(states.tileStates.WINNER);
                board[y - i][x + i].updateSprite();
            } else if (chain == states.winStates.downLeft){
                board[y + i][x - i].setState(states.tileStates.WINNER);
                board[y + i][x - i].updateSprite();
            } else if (chain == states.winStates.downRight){
                board[y + i][x + i].setState(states.tileStates.WINNER);
                board[y + i][x + i].updateSprite();
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