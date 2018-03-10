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
        // resets the highlighting for player placed pieces
        if (currentState != gameProperties.AIPlayerTurn){
            hoverOut();
            hoverOver();
        }
    }

    this.winTween = function(){
        var tween = game.add.tween(sprite);
        tween.to({x: tile.x - 3, y: tile.y - 3}, 200, Phaser.Easing.Circular.easeOut);
        tween.start();
    }

    this.highlight = function(color = 0xFFFFFF){
        sprite.tint = color;
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
        let board = game.state.states.default.board;
        let first = true;
        for(let y = gameProperties.boardHeight - 1, x = tile.col; y >= 0; y--){
            if (board.getTile(x, y).getState() == states.tileStates.EMPTY){
                if (first == true){
                    board.getTile(x, y).highlight(gameProperties.playerTurnHex[states.playerTurn]);
                    first = false;
                } else {
                    board.getTile(x, y).highlight();
                }
            }
        }
    }

    var hoverOut = function(){
        let board = game.state.states.default.board;
        for (let x = 0; x < gameProperties.boardWidth; x++){
            for (let y = 0; y < gameProperties.boardHeight; y++){
                board.getTile(x, y).resetHighlight();
            }
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

