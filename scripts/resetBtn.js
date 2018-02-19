var ResetBtn = function(){
    var sprite = game.add.sprite(gameProperties.screenWidth - 200, gameProperties.screenHeight - 400, "resetBtn");
    sprite.tint = 0xDDDDDD;

    var init = function(){
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputOver.add(hoverOver, this);
        sprite.events.onInputOut.add(hoverOut, this);
        sprite.events.onInputDown.add(click, this);
    }

    var hoverOver = function(){
        sprite.tint = 0xFFFFFF;
    }

    var hoverOut = function(){
        sprite.tint = 0xDDDDDD;
    }

    var click = function(){
        game.state.restart();
    }

    init();
}