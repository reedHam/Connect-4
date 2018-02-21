// Tile constructor 
var Tile = function (col, row, group){
    
    this.col = col;
    this.row = row;
    this.x = col * gameProperties.tileWidth;
    this.y = row * gameProperties.tileHeight;

    var tile = this;
    var currentState = states.tileStates.EMPTY;

    var sprite = game.add.sprite(col * (gameProperties.tileWidth + gameProperties.tilePadding), row * (gameProperties.tileHeight + gameProperties.tilePadding), currentState, null, group);
    sprite.scale.set(gameProperties.scale, gameProperties.scale)
    
    // default highlighting is accomplished by removing this tint
    sprite.tint = 0xdddddd;

    this.getState = function(){
        return currentState;
    }

    this.setState = function(newState){
        currentState = newState;
    }
    
    this.disableInput = function(){
        sprite.inputEnabled = false;
    }

    this.updateSprite = function(){
        sprite.loadTexture(currentState);
        hoverOut();
        hoverOver();
    }

    this.winTween = function(){
        var tween = game.add.tween(sprite);
        tween.to({x: tile.x - 3, y: tile.y - 3}, 200, Phaser.Easing.Circular.easeOut);
        tween.start();
    }

    this.resetHighlight = function(){
        sprite.tint = 0xdddddd;
    }

    var init = function(){
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputOver.add(hoverOver, this);
        sprite.events.onInputOut.add(hoverOut, this);
        sprite.events.onInputDown.add(click, this);
    }

    var hoverOver = function(){
        // checks from the bottom up for empty tiles and highlights them (highlights the placement tile green)
        let first = true;
        for (let i = group.children.length - (gameProperties.boardWidth - tile.col), rowLn = gameProperties.boardWidth; i >= 0; i -= rowLn){
            if (group.children[i].key === states.tileStates.EMPTY){
                if(first == true){
                    group.children[i].tint = gameProperties.playerTurnHex[states.playerTurn];
                    first = false;
                } else {
                    group.children[i].tint = 0xFFFFFF;
                }
            }
        }
    }

    // so the ai can clear the highlighting 
    var hoverOut = function(){
        // resets tint
        for (let i = group.children.length - (gameProperties.boardWidth - tile.col), rowLn = gameProperties.boardWidth; i >= 0; i -= rowLn){
            group.children[i].tint = 0xDDDDDD;
        }
    }
    
    var click = function(){
        // checks from the bottom up for empty tiles sets the tile state
        let board = game.state.states.default.board;
        for(let y = gameProperties.boardHeight - 1, x = tile.col; y >= 0; y--){
            let tempTile = board.getTile(x, y);
            if (tempTile.getState() == states.tileStates.EMPTY){
                tempTile.setState(states.playerTurn);
                tempTile.disableInput();
                // changes player turn
                states.playerTurn = states.playerTurn == states.tileStates.RED ? states.tileStates.YELLOW : states.tileStates.RED;
                states.modified.value = !states.modified.value;
                states.modified.x = tempTile.col;
                states.modified.y = tempTile.row;
                break;
            }
        }

    }
    // to allow for virtual clicks
    this.click = click;
    init();
}

