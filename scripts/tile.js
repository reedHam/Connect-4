// Tile constructor 
var Tile = function (col, row, group){
    
    this.col = col;
    this.row = row;
    this.x = col * gameProperties.tileWidth;
    this.y = row * gameProperties.tileHeight;

    var tile = this;
    var states = {
        EMPTY: "EMPTY",
        RED: "RED",
        YELLOW: "YELLOW"
    };
    var currentState = states.EMPTY;

    var sprite = game.add.sprite(col * (gameProperties.tileWidth + gameProperties.tilePadding), row * (gameProperties.tileHeight + gameProperties.tilePadding), currentState, null, group);


    sprite.tint = 0xdddddd;

    var init = function(){
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputOver.add(hoverOver, this);
        sprite.events.onInputOut.add(hoverOut, this);
        sprite.events.onInputDown.add(click, this);
    }

    var hoverOver = function(){
        // checks from the bottom up for empty tiles and highlights them
        let first = true;
        for (let i = group.children.length - (gameProperties.boardWidth - tile.col), rowLn = gameProperties.boardWidth; i >= 0; i -= rowLn){
            if (group.children[i].key === states.EMPTY){
                if(first == true){
                    group.children[i].tint = 0x00FF00;
                    first = false;
                } else {
                    group.children[i].tint = 0xFFFFFF;
                }
            }
        }
    }

    var hoverOut = function(){
        for (let i = group.children.length - (gameProperties.boardWidth - tile.col), rowLn = gameProperties.boardWidth; i >= 0; i -= rowLn){
            group.children[i].tint = 0xDDDDDD;
        }
    }

    var click = function(){
        // checks from the bottom up for empty tiles sets the tile state
        for (let i = group.children.length - (gameProperties.boardWidth - tile.col), rowLn = gameProperties.boardWidth; i >= 0; i -= rowLn){
            if (group.children[i].key === states.EMPTY){
                // first player is red BUGFIX
                if (gameState.playerTurn == undefined){
                    gameState.playerTurn = states.RED;
                }
                group.children[i].loadTexture(gameState.playerTurn);
                console.log(gameState.playerTurn, states.RED);
                if (gameState.playerTurn === states.RED){
                    gameState.playerTurn = states.YELLOW;
                } else {
                    gameState.playerTurn = states.RED;
                }
                break;
            }
        }
        // refresh the tile col
        hoverOut();
        hoverOver();
    }

    this.checkWin = function(){
        
    }


    init();
}

