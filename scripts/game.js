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

    AIEnable1: true,
    AIPlayerTurn1: "RED",

    AIEnable2: true,
    AIPlayerTurn2: "YELLOW",

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
        up: "U",
        upLeft: "UL",
        upRight: "UR",
        right: "R"
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
        this.win = false;
        this.btnReset = new ResetBtn();
        this.AIPlayer1 = new miniMaxAI(1, gameProperties.AIPlayerTurn1);
        this.AIPlayer2 = new miniMaxAI(5, gameProperties.AIPlayerTurn2);
    },

    update: function () {
        // upadtes game sprites when they are modified
        if (states.modified.value == true) {
            let tempTile = this.board.getTile(states.modified.x, states.modified.y);
            tempTile.updateSprite();
            states.modified.value = !states.modified.value;

            let result = checkWin(this.board, states.modified.x, states.modified.y, tempTile.getState());
            if (result){
                game.add.game.add.text(game.world.centerX, game.world.centerY - this.boardTop, tempTile.getState() + " PLAYER WINS", 
                { font: "65px Arial", fill: tempTile.getState(), align: "center", stroke:"#111111", strokeThickness: 6 }).anchor.setTo(0.5);
                displayWin(result.direction, result.start.x, result.start.y, this.board);
                this.win = true;
            }
        }

        if (states.playerTurn == gameProperties.AIPlayerTurn1 && gameProperties.AIEnable1 == true && this.win != true){
            this.AIPlayer1.preformTurn(this.board);
            return;
        }

        if (states.playerTurn == gameProperties.AIPlayerTurn2 && gameProperties.AIEnable2 == true && this.win != true){
            this.AIPlayer2.preformTurn(this.board);
        }
    }
};


var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'gameDiv', gameSkelli);

