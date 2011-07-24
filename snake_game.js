function draw(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
   
    var snake = Snake();
    snake.init({pos_x: 4, pos_y: 4, v_x: 1, v_y: 0});
    snake.eat();

    var foodList = FoodList();
    foodList.addFoodRandom(snake);

    $(document).keyup( function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        switch(code) {
            case 37:
                snake.goLeft();
                return false;
            case 39:
                snake.goRight();
                return false;
            case 38:
                snake.goUp();
                return false;
            case 40:
                snake.goDown();
                return false;
        }
    });
    var intervalID = window.setInterval( function() {
        canvas_elem.width = canvas_elem.width;
        canvas_context.strokeRect(0,
                                  0,
                                  GameParameters.board_width*GameParameters.block_size,
                                  GameParameters.board_height*GameParameters.block_size);
        snake.iterate();
        eatDetection(snake, foodList);

        if (outOfBoundsDetection(snake) || snake.checkTailCollision()) {
            window.clearInterval(intervalID);
            drawGameOver(canvas_context);
            gameInitialized = false;
            return;
        }
        snake.paint(canvas_context);
        foodList.paint(canvas_context);
    }, 200);

}

function drawGameOver(canvas_context) {
    canvas_context.fillRect(0,
                            0,
                            GameParameters.board_width*GameParameters.block_size,
                            GameParameters.board_height*GameParameters.block_size);

    canvas_context.font = "bold 15px sans-serif";
    canvas_context.fillStyle = "white";

    canvas_context.fillText("GAME OVER",
                            70,                                    
                            (GameParameters.board_width * GameParameters.block_size)/2);

}
function drawWelcomeScreen(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
    canvas_context.fillRect(0,
                            0,
                            GameParameters.board_width*GameParameters.block_size,
                            GameParameters.board_height*GameParameters.block_size);

    canvas_context.font = "bold 15px sans-serif";
    canvas_context.fillStyle = "white";

    canvas_context.fillText("Press SPACE to start game!",
                            70,                                    
                            (GameParameters.board_width * GameParameters.block_size)/2);


}

var GameParameters = {block_size:15, board_width:15, board_height:15};
var Snake = (function() {
    var obj = {},
        blocks = [],
        GO_UP = 0,
        GO_RIGHT = 1,
        GO_DOWN = 2,
        GO_LEFT = 3,
        state = GO_RIGHT,
        size = 1;

    obj.init = function(param) {
        var _block = Block();
        state = GO_RIGHT;
        _block.init(param);
        blocks.push(_block);
    };

    obj.iterate = function() {
        var result = [];

        for (var i=0; i < blocks.length; i++) {
            var now = blocks[i].iterate();
        }        
        
        // Update speeds
        for (i=blocks.length-1; i > 0; i--) {
            prev_block_speed = blocks[i-1].getSpeed();
            blocks[i].setSpeed(prev_block_speed[0], prev_block_speed[1]);
        }
        
    };

    obj.paint = function(canvas_context) {
        for (var i=0; i < blocks.length; i++) {
            blocks[i].paint(canvas_context);
        }
    };

    obj.head_position = function() {
        return blocks[0].getPosition();
    };

    obj.eat = function() {
        var _new_block, _last_block_pos;
        _new_block = Block();
        _last_block_pos = blocks[blocks.length - 1].getPosition();
        _new_block.init({
                            pos_x:_last_block_pos[0]-1,
                            pos_y: _last_block_pos[1], 
                            v_x: 1, 
                            v_y: 0});
        size += 1;
        blocks.push(_new_block);
    };

    obj.checkTailCollision = function() {
        var head_pos = blocks[0].getPosition();

        for (var i=1; i < blocks.length; i++) { // starts with 1, skip head
            _blockPos = blocks[i].getPosition();
            if (head_pos[0] === _blockPos[0] && head_pos[1] === _blockPos[1]) {
                console.log("Snake hit himself at " + head_pos[0] + " " + head_pos[1]);
                return true;
            }
        }

        return false;
    };

    obj.isOn = function(x, y) {
        // Returns true/false if snake is occupying (x,y)
        for (var i=0; i < blocks.length; i++) {
            _blockPos = blocks[i].getPosition();
            if (_blockPos[0] === x && _blockPos[1] === y) {
                return true;
            }
        }
        return false;
    }

    obj.goUp = function() {
        if (state != GO_DOWN) {
            blocks[0].goUp();
            state = GO_UP;
        }
    };
    obj.goDown = function() {
        if (state != GO_UP) {
            blocks[0].goDown();
            state = GO_DOWN;
        }
    };
    obj.goLeft = function() {
        if (state != GO_RIGHT) {
            blocks[0].goLeft();
            state = GO_LEFT;
        }
    };
    obj.goRight = function() {
        if (state != GO_LEFT) {
            blocks[0].goRight();
            state = GO_RIGHT;
        }
    };

    return obj;
});

var FoodList = (function() {
    var obj = {};
    obj.list = [];

    obj.addFood = function(x, y) {
        var _newBlock = Block();
        _newBlock.init({pos_x:x, pos_y:y, v_x:0, v_y:0});
        obj.list.push(_newBlock);
    }
    obj.addFoodRandom = function(snake) {
        var x, y;
        while(true) {
            x = Math.floor(Math.random() * GameParameters.board_width);
            y = Math.floor(Math.random() * GameParameters.board_height);
            if (snake.isOn(x, y) === false) {
                break;
            }
        }
        obj.addFood(x, y);
    }

    obj.removeFood = function(x, y) {
        for (var i=0; i < obj.list.length; i++) {
            item_pos = obj.list[i].getPosition();
            if (item_pos[0] === x && item_pos[1] === y) {
                obj.list.splice(i, 1);
            }
        }
    }
    
    obj.paint = function(canvas_context) {
        for (var i=0; i < obj.list.length; i++) {
            obj.list[i].paint(canvas_context);
        }
    }
    return obj;

});

var Block = (function() {

    var obj = {},
        pos_x = 0,
        pos_y = 0,
        v_x = 1,
        v_y = 0;

    obj.init = function(param) {
        pos_x = param.pos_x;
        pos_y = param.pos_y;
        v_x = param.v_x;
        v_y = param.v_y;
    }
    obj.iterate = function() {
        pos_x += v_x;
        pos_y += v_y;
        result = {};
        result.pos_x = pos_x;
        result.pos_y = pos_y;
        return result;
    }

    obj.setSpeed = function(vx, vy) {
        v_x = vx;
        v_y = vy;
    }

    obj.getSpeed = function() {
        return [v_x, v_y];
    }
    obj.getPosition = function() {
        return [pos_x, pos_y];
    }

    obj.goUp = function() {
        v_y = -1;
        v_x = 0;
    }
    obj.goDown = function() {
        v_y = 1;
        v_x = 0;
    }
    obj.goLeft = function() {
        v_x = -1;
        v_y = 0;
    }
    obj.goRight = function() {
        v_x = 1;
        v_y = 0;
    }
    obj.paint = function(canvas_context) {
        canvas_context.fillRect(pos_x * GameParameters.block_size,
                                pos_y * GameParameters.block_size,
                                GameParameters.block_size,
                                GameParameters.block_size);
    }

    return obj;
});

function eatDetection(snake, foodlist) {
    var snakeHeadPos = snake.head_position();
    var deleteItems = [];

    // Check if snake eats food
    for (var i=0; i < foodlist.list.length; i++) {
    
        item_pos = foodlist.list[i].getPosition();
        if (item_pos[0] === snakeHeadPos[0] && item_pos[1] === snakeHeadPos[1]) {
            deleteItems.push(i);
        }
    }

    for (i=0; i < deleteItems.length; i++) {
        // Removes element
        foodlist.list.splice(deleteItems[i], 1);
        
        // Snake gets bigger
        snake.eat();

        // Add food in random location
        foodlist.addFoodRandom(snake);

    }

}

function outOfBoundsDetection(snake) {
    var snakeHeadPos = snake.head_position();
    if (snakeHeadPos[0] >= GameParameters.board_width ||
        snakeHeadPos[0] < 0 ||
        snakeHeadPos[1] >= GameParameters.board_height ||
        snakeHeadPos[1] < 0) {
            console.log("Out of bounds! Game over!");
            console.log("Board width: " + GameParameters.board_width);
            console.log("Board height: " + GameParameters.board_height);
            console.log("Snake x : " + snakeHeadPos[0]);
            console.log("Snake y : " + snakeHeadPos[1]);
            return true;
    }
    return false;
   

}
var gameInitialized = false;
$(document).onload = (function() {
    drawWelcomeScreen("drawArea");
    $(document).keyup( function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 32) {
            if (gameInitialized === false) {
                draw("drawArea");
                gameInitialized = true;
            }
            return false;
        }
    });

})();
