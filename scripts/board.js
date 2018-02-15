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
}