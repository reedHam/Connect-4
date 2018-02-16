var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,

    tileWidth: 32,
    tileHeight: 32,
    tilePadding: 5,

    boardWidth: 9,
    boardHeight: 9,
};

var states = {
    game: "game",
};

var gameState = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
    this.playerTurn;
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