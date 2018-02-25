class GameState {
    constructor(board, playerTurn, move = null){
        this.move = move;
        this.board = board;
        this.playerTurn = playerTurn;
    }

    genSuccessors() {
        let successors = [];
        let nextTurn = this.playerTurn == states.tileStates.RED ? states.tileStates.YELLOW : states.tileStates.RED;

        for (let x = 0, ln = gameProperties.boardWidth; x < ln; x++){
            // only place if is empty col
            if (this.board[x][0] == states.tileStates.EMPTY){
                let childMove = {player: this.playerTurn, x:-1, y:-1};
                let childBoard = this.board.map(row => {
                    return row.slice();
                });

                // start form bottom and place in first spot
                for (let y = gameProperties.boardHeight - 1; y  >= 0; y--){
                    if (childBoard[x][y] == states.tileStates.EMPTY){
                        childBoard[x][y] = this.playerTurn;
                        childMove.x = x;
                        childMove.y = y;
                        break;
                    }
                }
                successors.push(new GameState(childBoard, nextTurn, childMove));
            }
        }
        return successors;
    }

    checkWin() {
        // need to check in star pattern for matching tile chain 
        length = gameProperties.winningChainLength - 1;
        let maxXidx = gameProperties.boardWidth - 1;
        let maxYidx = gameProperties.boardHeight - 1;
        let up = true;
        let down = true;
        let left = true;
        let right = true;
        let upLeft = true;
        let upRight = true; 
        let downLeft = true;
        let downRight = true;
        
        // protection from reading past indexes
        
        if ((this.move.y - length) < 0){
            up = false;
            upLeft = false;
            upRight = false;
        }

        if ((this.move.y + length) > maxYidx){
            down = false;
            downLeft = false;
            downRight = false;
        }

        if ((this.move.x - length) < 0){
            left = false
            upLeft = false;
            downLeft = false;
        }

        if ((this.move.x + length) > maxXidx){
            right = false;
            upRight = false;
            downRight = false;
        }

        // check the star shape
        for (let i = 0; i <= length; i++){
            if (up && this.board[this.move.x][this.move.y - i] != this.move.player){
                up = false;
            }

            if (down && this.board[this.move.x][this.move.y + i] != this.move.player){
                down = false;
            }

            if (left && this.board[this.move.x - i][this.move.y] != this.move.player){
                left = false;
            }

            if (right && this.board[this.move.x + i][this.move.y] != this.move.player){
                right = false;
            }

            if (upLeft && this.board[this.move.x - i][ this.move.y - i] != this.move.player){
                upLeft = false;
            }

            if (upRight && this.board[this.move.x + i][this.move.y - i] != this.move.player){
                upRight = false;
            }

            if (downLeft && this.board[this.move.x - i][this.move.y + i] != this.move.player){
                downLeft = false;
            }

            if (downRight && this.board[this.move.x + i][ this.move.y + i] != this.move.player){
                downRight = false;
            }
        }
        
        return up || down || left || right || upLeft || downLeft || upRight || downRight;
    }
}