function checkWin(board, x , y, playedState){
    const maxYindex = gameProperties.boardHeight - 1;
    const maxXindex = gameProperties.boardWidth - 1;
    const maxLength = gameProperties.winningChainLength - 1;

    for (let i = 0; i <= maxLength; i++){
        let up = {direction: states.winStates.up, start: {
            x: x,
            y: y + i
        }};

        let upLeft = {direction: states.winStates.upLeft, start: {
            x: x + i,
            y: y + i
        }};

        let upRight = {direction: states.winStates.upRight, start: {
            x: x - i,
            y: y + i
        }};

        let right = {direction: states.winStates.right, start: {
            x: x - i,
            y: y
        }};


        // Bounding

        // up
        if (((up.start.y) > maxYindex) || (((up.start.y) - maxLength) < 0)){
            up.direction = null;
            upLeft.direction = null;
            upRight.direction = null;
        }

        // right
        if (((right.start.x) < 0) || ((right.start.x) + maxLength) > maxXindex){
            right.direction = null;
            upRight.direction = null;
        }

        // left
        if (((upLeft.start.x) > maxXindex) || ((upLeft.start.x) - maxLength) < 0){
            upLeft.direction = null;
        }
        
        
        for (let j = 0; j <= maxLength; j++){
            // up
            if (up.direction != null){
                if (board.getTile(up.start.x, up.start.y - j).getState() != playedState){
                    up.direction = null;
                }    
            }

            // upLeft
            if (upLeft.direction != null){
                if (board.getTile(upLeft.start.x - j, upLeft.start.y - j).getState() != playedState){
                    upLeft.direction = null;
                }
            }  


            // upRight
            if (upRight.direction != null) {
                if (board.getTile(upRight.start.x + j, upRight.start.y - j).getState() != playedState){
                    upRight.direction = null;
                }
            }

            // right
            if (right.direction != null){
                if (board.getTile(right.start.x + j, right.start.y).getState() != playedState){
                    right.direction = null;
                }
            } 
        }

        // if a direction is still direction then that is the winning direction
        if (up.direction != null){
            return up;
        }

        if (upLeft.direction != null){
            return upLeft;
        }

        if (upRight.direction != null) {
            return upRight;
        }

        if (right.direction != null){
            return right;
        }
    }
    // no winner
    return null;
}


// tweens the tiles to display a winning combination
function displayWin(direction, x, y, board){
    for (let i = 0; i < gameProperties.winningChainLength; i++){
        switch (direction){
            case states.winStates.up:  
                board.getTile(x, y - i).winTween();
                break;

            case states.winStates.upLeft:
                board.getTile(x - i, y - i).winTween();
                break;

            case states.winStates.upRight:
                board.getTile(x + i, y - i).winTween();
                break;

            case states.winStates.right:
                board.getTile(x + i, y).winTween();
                break;

            default:
                throw "ERROR DISPLAYING WIN STATE";
        }
    }

    for (let x = 0; x < gameProperties.boardWidth; x++){
        for (let y = 0; y < gameProperties.boardHeight; y++){
            board.getTile(x, y).resetHighlight();
            board.getTile(x, y).disableInput();
        }
    }
}