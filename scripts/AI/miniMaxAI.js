var negInfinity = Number.NEGATIVE_INFINITY;
var infinity = Infinity;

class miniMaxAI {
    constructor(maxDepth){
        this.player = states.tileStates.RED;
        this.maxDepth = maxDepth;
        this.currentState = null;
    }

    // takes x, gameState.move.y cord of tile and length of winning tile chain
    checkWin (gameState, length){
        // need to check in star pattern for matching tile chain 
        length = length - 1;
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
        if ((gameState.move.y - length) < 0){
            up = false;
            upLeft = false;
            upRight = false;
        }

        if ((gameState.move.y + length) > maxYidx){
            down = false;
            downLeft = false;
            downRight = false;
        }

        if ((gameState.move.x - length) < 0){
            left = false
            upLeft = false;
            downLeft = false;
        }

        if ((gameState.move.x + length) > maxXidx){
            right = false;
            upRight = false;
            downRight = false;
        }

        // check the star shape
        for (let i = 0; i <= length; i++){
            if (up && gameState.board[gameState.move.x][gameState.move.y - i] != gameState.move.turn){
                up = false;
            }

            if (down && gameState.board[gameState.move.x][gameState.move.y + i] != gameState.move.turn){
                down = false;
            }

            if (left && gameState.board[gameState.move.x - i][gameState.move.y] != gameState.move.turn){
                left = false;
            }

            if (right && gameState.board[gameState.move.x + i][gameState.move.y]!= gameState.move.turn){
                right = false;
            }

            if (upLeft && gameState.board[gameState.move.x - i][gameState.move.y - i] != gameState.move.turn){
                upLeft = false;
            }

            if (upRight && gameState.board[gameState.move.x + i][gameState.move.y - i] != gameState.move.turn){
                upRight = false;
            }

            if (downLeft && gameState.board[gameState.move.x - i][gameState.move.y + i] != gameState.move.turn){
                downLeft = false;
            }

            if (downRight && gameState.board[gameState.move.x + i][gameState.move.y + i] != gameState.move.turn){
                downRight = false;
            }
        }
        return up || down || left || right || upLeft || downLeft || upRight || downRight;
    }

    miniMax (gameState, alpha = negInfinity, beta = infinity, depth = 0){
        if (depth > this.maxDepth){
            return 0;
        }
        // if terminal
        if (this.checkWin(gameState, gameProperties.winningChainLength)){
            
            if (gameState.move.turn = this.player){
                return 1;
            } else {
                return -1;
            }
        }

        if (gameState.turn == this.player){
            var maxValue = negInfinity;

            //all the possible moves 
            let actions = [];
            for(let i = 0, ln = gameProperties.boardWidth; i < ln; i++){
                let newAction = gameState.preformMove(i);
                // if new action is defined
                if (newAction) {
                    actions.push(newAction);
                }
            }
            
            actions.some(action => {
                let val = this.miniMax(action, alpha, beta, depth + 1);
                maxValue = Math.max(maxValue, val);
                alpha = Math.max(maxValue, alpha);

                // prune if worse choice.
                return beta <= alpha;
            });
            return maxValue;

        } else {
            var minValue = infinity;

            //all the possible moves 
            let actions = [];
            for(let i = 0, ln = gameProperties.boardWidth; i < ln; i++){
                let newAction = gameState.preformMove(i);
                // if new action is defined
                if (newAction) {
                    actions.push(newAction);
                }
            }
            
            actions.some(action =>{
                let val = this.miniMax(action, alpha, beta, depth + 1);
                minValue = Math.min(minValue, val);
                beta = Math.min(minValue, alpha);

                // prune if worse choice.
                return beta <= alpha;
            });
            return minValue;
        }
    }

    
    preformTurn(board){
        var gameBoardSmpl = [];
        for(let x = 0 , xlen = gameProperties.boardWidth; x < xlen; x++){
            gameBoardSmpl.push([]);
            for(let y = 0, ylen = gameProperties.boardHeight; y < ylen; y++){
                gameBoardSmpl[x].push(board.getTile(x, y).getState());
            }
        }

        this.currentState = new GameState(gameBoardSmpl, states.playerTurn);
        //all the possible moves 
        let actions = [];
        for(let i = 0, ln = gameProperties.boardWidth; i < ln; i++){
            let newAction = this.currentState.preformMove(i);
            // if new action is defined
            if (newAction) {
                actions.push(newAction);
            }
        }

        let bestMoves = [];
        let nutMoves = [];
        actions.forEach(action => {
            let miniMaxVal = this.miniMax(action);
            if (miniMaxVal == 1){
                bestMoves.push(action.move);
            } else if (miniMaxVal == 0) {
                nutMoves.push(action.move);
            } 
        });
        
        if (bestMoves.length > 0){
            board.getTile(bestMoves[0].x, 0).click();
        } else if (nutMoves.length > 0) {
            board.getTile(nutMoves[0].x, 0).click();
        } else {
            board.getTile(getRandomInt(gameProperties.boardWidth(), 0)).click();
        }
        
    }
}
