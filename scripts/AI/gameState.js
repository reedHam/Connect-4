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
        const maxYindex = gameProperties.boardHeight - 1;
        const maxXindex = gameProperties.boardWidth - 1;
        const maxLength = gameProperties.winningChainLength - 1;

        for (let i = 0; i <= maxLength; i++){
            let up = {valid: true, start: {
                x: this.move.x,
                y: this.move.y + i
            }};

            let upLeft = {valid: true, start: {
                x: this.move.x + i,
                y: this.move.y + i
            }};

            let upRight = {valid: true, start: {
                x: this.move.x - i,
                y: this.move.y + i
            }};

            let right = {valid: true, start: {
                x: this.move.x - i,
                y: this.move.y
            }};


            // Bounding

            // up
            if (((up.start.y) > maxYindex) || (((up.start.y) - maxLength) < 0)){
                up.valid = false;
                upLeft.valid = false;
                upRight.valid = false;
            }

            // right
            if (((right.start.x) < 0) || ((right.start.x) + maxLength) > maxXindex){
                right.valid = false;
                upRight.valid = false;
            }

            // left
            if (((upLeft.start.x) > maxXindex) || ((upLeft.start.x) - maxLength) < 0){
                upLeft.valid = false;
            }
            
            
            for (let j = 0; j <= maxLength; j++){
                // up
                if (up.valid){
                    if (this.board[up.start.x][up.start.y - j] != this.move.player){
                        up.valid = false;
                    }    
                }

                // upLeft
                if (upLeft.valid){
                    if (this.board[upLeft.start.x - j][upLeft.start.y - j] != this.move.player){
                        upLeft.valid = false;
                    }
                }  


                // upRight
                if (upRight.valid) {
                    if (this.board[upRight.start.x + j][upRight.start.y - j] != this.move.player){
                        upRight.valid = false;
                    }
                }

                // right
                if (right.valid){
                    if (this.board[right.start.x + j][right.start.y] != this.move.player){
                        right.valid = false;
                    }
                } 
            }

            // if a direction is still valid
            if (up.valid || upLeft.valid || upRight.valid || right.valid){
                return true;
            }
        }
        // no winner
        return false;
    }
}