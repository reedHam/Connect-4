class miniMaxAI {
    constructor(maxDepth, turn){
        this.maxDepth = maxDepth;
        this.turn = turn;
    }

    // maps the sprite board to an array of only states
    stripBoard(board){
        let stripedBoard = [];
        for (let x = 0, xln = gameProperties.boardWidth; x < xln; x++){
            stripedBoard.push([]);
            for (let y = 0, yln = gameProperties.boardHeight; y < yln; y++){
                stripedBoard[x].push(board.getTile(x, y).getState());
            }
        }
        return stripedBoard;
    }

    // looks for chains of varying length and assigns a value based on the length of the chain 
    // formula is (length of chain * 10)^length of chain
    evaluateBoard(board){
        // helper function to increment counts of a tile
        function incrementCounts(countsObj, state){
            if (state == states.tileStates.RED){
                countsObj.red++;
            } else if (state == states.tileStates.YELLOW) {
                countsObj.yellow++;
            }
        }

        // helper function gives 2 chains 3 chains
        function assignPlayerScores(chainObj){
            if (chainObj.valid){
                if (chainObj.counts.red > 0 && chainObj.counts.yellow == 0){
                    redPlayerCount += Math.pow(10 * chainObj.counts.red, chainObj.counts.red);
                } else if (chainObj.counts.yellow > 0 && chainObj.counts.red == 0){
                    yellowPlayerCount += Math.pow(10 * chainObj.counts.yellow, chainObj.counts.yellow);
                }
            }
        }

        let chainLength = gameProperties.winningChainLength;
        let maxXidx = gameProperties.boardWidth - 1;
        let maxYidx = gameProperties.boardHeight - 1;

        let redPlayerCount = 0;
        let yellowPlayerCount = 0;
        
        for (let x = 0, xln = gameProperties.boardWidth; x < xln; x++){
            for (let y = 0, yln = gameProperties.boardHeight; y < yln; y++){

                // these objects contain a boolean signifying wether a set is valid i.e only one players tiles and empty tiles and length is within bounds
                // as well as the count for the number of tiles
                let left = {valid: true, counts:{red: 0, yellow: 0}};
                let right = {valid: true, counts:{red: 0, yellow: 0}};
                let down = {valid: true, counts:{red: 0, yellow: 0}};
                let downLeft = {valid: true, counts:{red: 0, yellow: 0}};
                let downRight = {valid: true, counts:{red: 0, yellow: 0}};
                

                // bound protection
                // left bound
                if ((x - chainLength + 1) < 0) {
                    left.valid = false;
                    downLeft.valid = false;
                }

                // right bound
                if ((x + chainLength - 1) > maxXidx){
                    right.valid = false;
                    downRight.valid = false;
                }

                // down bound
                if ((y + chainLength - 1) > maxYidx){
                    down.valid = false;
                    downLeft.valid = false;
                    downRight.valid = false;
                }


                for (let i = 0; i < chainLength; i++){
                    // left
                    if (left.valid){
                        incrementCounts(left.counts, board[x - i][y]);
                    }

                    // right
                    if (right.valid){
                        incrementCounts(right.counts, board[x + i][y]);
                    }

                    // down
                    if (down.valid){
                        incrementCounts(down.counts, board[x][y + i]);
                    }

                    // down left
                    if (downLeft.valid){
                        incrementCounts(downLeft.counts, board[x - i][y + i]);
                    }

                    // down right
                    if (downRight.valid){
                        incrementCounts(downRight.counts, board[x + i][y + i]);
                    }

                }
                assignPlayerScores(left);
                assignPlayerScores(right);
                assignPlayerScores(down);
                assignPlayerScores(downLeft);
                assignPlayerScores(downRight);
            }
        }
        return this.turn == "RED" ? redPlayerCount - yellowPlayerCount : yellowPlayerCount - redPlayerCount;
    }


    // Helper min function for minimax with alpha beta
    minVal (gameState, alpha, beta, depth){
        if (depth >= this.maxDepth || gameState.checkWin()){
            return this.evaluateBoard(gameState.board);
        }

        let v = Infinity;
        let successors = gameState.genSuccessors();
        for (let i = 0, ln = successors.length; i < ln; i++){
            v = Math.min(v, this.maxVal(successors[i], alpha, beta, depth + 1));

            if (v <= alpha) return v;

            beta = Math.min(beta, v);
        }
        return v;
    }

    // Helper max function for minimax with alpha beta
    maxVal (gameState, alpha, beta, depth){
        if (depth >= this.maxDepth || gameState.checkWin()){
            return this.evaluateBoard(gameState.board);
        }

        let v = Number.NEGATIVE_INFINITY;
        let successors = gameState.genSuccessors();
        for (let i = 0, ln = successors.length; i < ln; i++){
            v = Math.max(v, this.minVal(successors[i], alpha, beta, depth + 1));

            if (v >= beta) return v;

            alpha = Math.max(alpha, v);
        }
        return v;
    }

    // returns the optimal move found before a specified depth using minimax and alpha beta pruning.
    // takes a GameState object.
    alphaBeta (gameState){
        let bestMove = -1;
        let bestVal = Number.NEGATIVE_INFINITY;
        gameState.genSuccessors().forEach(successor => {
            let minSuccessor = this.minVal(successor, Number.NEGATIVE_INFINITY, Infinity, 0);
            if (minSuccessor >= bestVal){
                bestVal = minSuccessor;
                bestMove = successor.move.x;
            }
        });
        return bestMove;
    }

    // clicks on the board in the location found
    preformTurn(board){
        let stripedBoard = this.stripBoard(board);
        let gameState = new GameState(stripedBoard, states.playerTurn);
        board.getTile(this.alphaBeta(gameState), 0).click();
        
    }
}
