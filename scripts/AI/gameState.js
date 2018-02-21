class GameState {
    constructor(board, turn = states.playerTurn, move = null){
        this.board = board;
        this.turn = turn;
        this.move = move;
    }

    // generates the new board based on the move given
    preformMove(move){
        // creates a copy of the board matrix
        var newBoard = this.board.map( function(arr) {
            return arr.slice();
        });
        var nextTurn = this.turn == states.tileStates.RED ? states.tileStates.YELLOW : states.tileStates.RED;
        
        for(let y = newBoard[0].length - 1, x = move; y >= 0; y--){
            if (newBoard[x][y] == states.tileStates.EMPTY){
                newBoard[x][y] = this.turn;
                return new GameState(newBoard, nextTurn, {turn: this.turn, x:x, y:y});
            }
        }
        return undefined;
    }
}