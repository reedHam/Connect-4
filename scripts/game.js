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

    AIEnable: true,
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
        this.AIPlayer = new miniMaxAI(2, gameProperties.AIPlayerTurn);
    },

    update: function () {
        
        if (states.modified.value == true) {
            let tempTile = this.board.getTile(states.modified.x, states.modified.y);
            tempTile.updateSprite();
            states.modified.value = !states.modified.value;

            let result = checkWin(this.board, states.modified.x, states.modified.y, tempTile.getState(), gameProperties.winningChainLength);
            
            if (result){
                console.log(result);
                displayWin(result, states.modified.x, states.modified.y, this.board);
                this.win = true;
            }
           
        }

        if (states.playerTurn == gameProperties.AIPlayerTurn && gameProperties.AIEnable == true && this.win != true){
                this.AIPlayer.preformTurn(this.board);
        }
    }
};


var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'gameDiv', gameSkelli);

