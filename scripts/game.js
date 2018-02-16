var gameProperties = {
    screenWidth: 1280,
    screenHeight: 720,

    tileWidth: 32,
    tileHeight: 32,
    tilePadding: 5,
    tileStates: {
        EMPTY: "EMPTY",
        RED: "RED",
        YELLOW: "YELLOW"
    },
    playerTurn: "RED",

    boardWidth: 10,
    boardHeight: 9,
};

var states = {
    game: "game",
};

var gameState = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
};

gameState.prototype = {
    init: function() {
        // center board within game window
        this.boardTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.boardHeight + gameProperties.tileHeight)) * 0.5;
        this.boardLeft = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.boardWidth + gameProperties.tileHeight)) * 0.5;
    },

    preload: function () {
        game.load.image("EMPTY", "sprites/empty.png");
        game.load.image("RED", "sprites/red.png");
        game.load.image("YELLOW", "sprites/yellow.png");
    },
    
    create: function () {
        this.board = new Board(gameProperties.boardWidth, gameProperties.boardHeight);
        this.board.moveTo(this.boardLeft, this.boardTop);
    },

    update: function () {
        
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
console.log(game);