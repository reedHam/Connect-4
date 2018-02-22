function checkWin(board, x , y, playedState, length){
    // need to check in star pattern for matching tile chain 
    length = length - 1;
    let maxXidx = gameProperties.boardWidth - 1;
    let maxYidx = gameProperties.boardHeight - 1;
    let up = states.winStates.up;
    let down = states.winStates.down;
    let left = states.winStates.left;
    let right = states.winStates.right;
    let upLeft = states.winStates.upLeft;
    let upRight = states.winStates.upRight; 
    let downLeft = states.winStates.downLeft;
    let downRight = states.winStates.downRight;
    
    // protection from reading past indexes
    
    if ((y - length) < 0){
        up = null;
        upLeft = null;
        upRight = null;
    }

    if ((y + length) > maxYidx){
        down = null;
        downLeft = null;
        downRight = null;
    }

    if ((x - length) < 0){
        left = null
        upLeft = null;
        downLeft = null;
    }

    if ((x + length) > maxXidx){
        right = null;
        upRight = null;
        downRight = null;
    }

    // check the star shape
    for (let i = 0; i <= length; i++){
        if (up && board.getTile(x, y - i).getState() != playedState){
            up = null;
        }

        if (down && board.getTile(x, y + i).getState() != playedState){
            down = null;
        }

        if (left && board.getTile(x - i, y).getState() != playedState){
            left = null;
        }

        if (right && board.getTile(x + i, y).getState() != playedState){
            right = null;
        }

        if (upLeft && board.getTile(x - i, y - i).getState() != playedState){
            upLeft = null;
        }

        if (upRight && board.getTile(x + i, y - i).getState() != playedState){
            upRight = null;
        }

        if (downLeft && board.getTile(x - i, y + i).getState() != playedState){
            downLeft = null;
        }

        if (downRight && board.getTile(x + i, y + i).getState() != playedState){
            downRight = null;
        }
    }
    
    return up || down || left || right || upLeft || downLeft || upRight || downRight;
}