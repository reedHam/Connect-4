// Tile constructor 
var Tile = function (col, row, group){
    

    // initialize public members
    this.col = col;
    this.row = row;
    this.x = col * gameProperties.tileWidth;
    this.y = row * gameProperties.tileHeight;

    // initialize private members
    var tile = this;
    var states = {
        EMPTY: "EMPTY",
        RED: "RED",
        YELLOW: "YELLOW"
    };
    var currentState = states.EMPTY;

    var sprite = game.add.sprite(col * gameProperties.tileWidth, row * gameProperties.tileHeight, currentState);
    group.add(sprite);

    
}

