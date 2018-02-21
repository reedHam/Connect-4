var gameProperties = {
    screenWidth: 1280,
    screenHeight: 720,

    scale: 2,
    tilePadding: 5,

    get tileWidth () {
        return 32 * this.scale;
    },
    get tileHeight (){
        return 32 * this.scale;
    },
    
    winningChainLength:4,

    boardWidth: 7,
    boardHeight: 6,

    AIEnable: false,
    AIPlayerTurn: "RED",

    playerTurnHex:{
        RED: "0xFF7777",
        YELLOW: "0xFFFF00"
    }
};

var states = {
    playerTurn: "RED",
    modified: {
        value: false,
        x: -1,
        y: -1
    },
    tileStates: {
        EMPTY: "EMPTY",
        RED: "RED",
        YELLOW: "YELLOW",
        WINNER: "WINNER"
    },
    winStates: {
        up: "up",
        down: "down",
        left: "left",
        right: "right",
        upLeft: "upLeft",
        upRight: "upRight",
        downLeft: "downLeft",
        downRight: "downRight"
    }
};

var gameSkelli = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
    this.btnReset;
    this.AIPlayer;
    this.win;

    // takes x, y cord of tile and length of winning tile chain
    this.checkWin = function(x, y, playedState, length){
        // need to check in star pattern for matching tile chain 
        let maxXidx = gameProperties.boardWidth - 1;
        let maxYidx = gameProperties.boardHeight - 1;
        let up = states.winStates.up;
        let down = states.winStates.down;
        let left = states.winStates.left;
        let right = states.winStates.right;
        let upLeft = states.winStates.upLeft;
        let upRight = states.winStates.upRight; 
        let downLeft = states.winStates.downLeft;
        let downRight = states.winStates.downRight;
        
        // protection from reading past indexes
        
        if ((y - length) < 0){
            up = null;
            upLeft = null;
            upRight = null;
        }

        if ((y + length) > maxYidx){
            down = null;
            downLeft = null;
            downRight = null;
        }

        if ((x - length) < 0){
            left = null
            upLeft = null;
            downLeft = null;
        }

        if ((x + length) > maxXidx){
            right = null;
            upRight = null;
            downRight = null;
        }

        // check the star shape
        for (let i = 0; i <= length; i++){
            if (up && this.board.getTile(x, y - i).getState() != playedState){
                up = null;
            }

            if (down && this.board.getTile(x, y + i).getState() != playedState){
                down = null;
            }

            if (left && this.board.getTile(x - i, y).getState() != playedState){
                left = null;
            }

            if (right && this.board.getTile(x + i, y).getState() != playedState){
                right = null;
            }

            if (upLeft && this.board.getTile(x - i, y - i).getState() != playedState){
                upLeft = null;
            }

            if (upRight && this.board.getTile(x + i, y - i).getState() != playedState){
                upRight = null;
            }

            if (downLeft && this.board.getTile(x - i, y + i).getState() != playedState){
                downLeft = null;
            }

            if (downRight && this.board.getTile(x + i, y + i).getState() != playedState){
                downRight = null;
            }
        }
        
        return up || down || left || right || upLeft || downLeft || upRight || downRight;
    }
};

gameSkelli.prototype = {
    init: function() {
        // center board within game window
        this.boardTop = (gameProperties.screenHeight - ((gameProperties.tileHeight - gameProperties.tilePadding) * gameProperties.boardHeight + gameProperties.tileHeight)) * 0.5;
        this.boardLeft = (gameProperties.screenWidth - ((gameProperties.tileWidth - gameProperties.tilePadding) * gameProperties.boardWidth + gameProperties.tileHeight)) * 0.5;
        this.win = false;
    },

    preload: function () {
        game.load.image("EMPTY", "sprites/empty.png");
        game.load.image("RED", "sprites/red.png");
        game.load.image("YELLOW", "sprites/yellow.png");
        game.load.image("WINNER", "sprites/winner.png");
        game.load.image("resetBtn", "sprites/resetbtn.png");
    },
    
    create: function () {
        game.stage.backgroundColor = "#222222";
        this.board = new Board(gameProperties.boardWidth, gameProperties.boardHeight);
        this.board.moveTo(this.boardLeft, this.boardTop);
        this.btnReset = new ResetBtn();
        this.AIPlayer = new miniMaxAI(5);
    },

    update: function () {
        
        if (states.modified.value == true) {
            let tempTile = this.board.getTile(states.modified.x, states.modified.y);

            tempTile.updateSprite();

            let result = this.checkWin(states.modified.x, states.modified.y, tempTile.getState(), gameProperties.winningChainLength - 1);
            if (result){
                // display winning text
                let winningText = game.add.text(game.world.centerX, game.world.centerY - this.boardTop, tempTile.getState() + " PLAYER WINS", 
                    { font: "65px Arial", fill: tempTile.getState(), align: "center", stroke:"#111111", strokeThickness: 6 }
                );
                winningText.anchor.setTo(0.5);
                this.board.displayWin(states.modified.x, states.modified.y, result);
                this.win = true;
            }
            states.modified.value = !states.modified.value;
        }

        if (states.playerTurn == gameProperties.AIPlayerTurn && gameProperties.AIEnable == true && this.win != true){
                this.AIPlayer.preformTurn(this.board);
            }
        }
};


var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'gameDiv', gameSkelli);

