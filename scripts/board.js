// Board constructor
var Board = function (cols, rows){
    var board = [];
    var group = game.add.group();

    for (let x = 0; x < cols; x++){
        var col = [];

        for (let y = 0; y < rows; y++){
            var tile = new Tile(x, y, group);
            col.push(tile);
        }

        board.push(col);
    }

    this.moveTo = function(x, y){
        group.x = x;
        group.y = y;
    }
    
    this.getTile = function(x, y){
        return board[x][y];
    }
}