function draw(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
   
    snake = Snake();
    snake.init({pos_x: 4, pos_y: 4, v_x: 1, v_y: 0});
    snake.eat(5);

    foodList = FoodList();
    foodList.addFoodRandom();

    var intervalID = window.setInterval( function() {
        canvas_elem.width = canvas_elem.width;
        canvas_context.strokeRect(0,
                                  0,
                                  GameParameters.board_width*GameParameters.block_size,
                                  GameParameters.board_height*GameParameters.block_size);
        snake.iterate();
        eatDetection(snake, foodList);

        if (outOfBoundsDetection(snake)) {
            window.clearInterval(intervalID);
            alert("Game over!");
        }
        snake.paint(canvas_context);
        foodList.paint(canvas_context);

    }, 100);

    $(document).keyup( function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        console.log(code);
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

}
var GameParameters = {block_size:10, board_width:40, board_height:40};
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
    }

    obj.eat = function(size) {
        var _new_block, _last_block_pos;
//        for(var i=0; i < size; i++) { 
            _new_block = Block();
            _last_block_pos = blocks[blocks.length - 1].getPosition();
            _new_block.init({
                                pos_x:_last_block_pos[0]-1,
                                pos_y: _last_block_pos[1], 
                                v_x: 1, 
                                v_y: 0});
            size += 1;
            blocks.push(_new_block);
  //      }
    }

    obj.goUp = function() {
        if (state != GO_DOWN) {
            blocks[0].goUp();
            state = GO_UP;
        }
    }
    obj.goDown = function() {
        if (state != GO_UP) {
            blocks[0].goDown();
            state = GO_DOWN;
        }
    }
    obj.goLeft = function() {
        if (state != GO_RIGHT) {
            blocks[0].goLeft();
            state = GO_LEFT;
        }
    }
    obj.goRight = function() {
        if (state != GO_LEFT) {
            blocks[0].goRight();
            state = GO_RIGHT;
        }
    }

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
    obj.addFoodRandom = function(x, y) {
        var x = Math.floor(Math.random() * GameParameters.board_width);
        var y = Math.floor(Math.random() * GameParameters.board_height);                   
        console.log("Add food on " + x + " " + y);
        obj.addFood(x, y);                    
    }

    obj.removeFood = function(x, y) {
        for (var i=0; i < obj.list.length; i++) {
            item_pos = obj.list[i].getPosition();
            if (item_pos[0] == x && item_pos[1] == y) {
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
        if (item_pos[0] == snakeHeadPos[0] && item_pos[1] == snakeHeadPos[1]) {
            deleteItems.push(i);
        }
    }

    for (i=0; i < deleteItems.length; i++) {
        // Removes element
        foodlist.list.splice(deleteItems[i], 1);
        
        // Snake gets bigger
        snake.eat(3);

        // Add food in random location
        foodlist.addFoodRandom();

    }

}

function outOfBoundsDetection(snake) {
    var snakeHeadPos = snake.head_position();
    if (snakeHeadPos[0] >= GameParameters.board_width ||
        snakeHeadPos[0] < 0 ||
        snakeHeadPos[1] > GameParameters.board_height ||
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
draw("drawArea");
