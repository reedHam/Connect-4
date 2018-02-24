var negInfinity = Number.NEGATIVE_INFINITY;
var infinity = Infinity;

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

    // looks for chains of varying length and assigns a value based on them
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
                    redPlayerCount += Math.pow(chainObj.counts.red, 10);
                } else if (chainObj.counts.yellow > 0 && chainObj.counts.red == 0){
                    yellowPlayerCount += Math.pow(chainObj.counts.yellow, 10);
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

                //console.log("left", left.valid, left.counts, x, y);
                //console.log("right", right.valid, right.counts, x, y);
                //console.log("down", down.valid, down.counts, x, y);
                //console.log("downLeft", downLeft.counts);
                //console.log("downRight", downRight.counts);

                assignPlayerScores(left);
                assignPlayerScores(right);
                assignPlayerScores(down);
                assignPlayerScores(downLeft);
                assignPlayerScores(downRight);
            }
        }
        return {RED: redPlayerCount - yellowPlayerCount, YELLOW: yellowPlayerCount - redPlayerCount};
    }


    alphaBeta (gameState, alpha = negInfinity, beta = infinity, depth = 0){
        
    }

    
    preformTurn(board){
        let stripedBoard = this.stripBoard(board);

        let currentState = new GameState(stripedBoard, states.playerTurn);
        let actions = currentState.genSuccessors();

        // init best move to one of the actions
        let bestMove = actions[0];
        bestMove.utility = this.miniMax(bestMove);
        
        // for check to see if the remaining actions are better than best move
        actions.forEach(action=> {
            action.utility = this.miniMax(action);
            if (action.utility >= bestMove.utility){
                bestMove = action;
            }
        });
        
        // preform move
        board.getTile(bestMove.move.x, 0).click();
    }
}
