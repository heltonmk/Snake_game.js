function draw(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
   
    snake = Snake();
    snake.init({pos_x: 40, pos_y: 40, v_x: GameParameters.block_size, v_y: 0});
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();

    foodList = FoodList();
    foodList.addFood(90, 90);

    window.setInterval( function() {
        canvas_elem.width = canvas_elem.width;
        snake.iterate();
        snake.paint(canvas_context);
        foodList.paint(canvas_context);

    }, 200);

    window.setInterval( function() {
        snake.eat();
    }, 2000);


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
var GameParameters = {block_size:10};
var Snake = (function() {
    var obj = {},
        blocks = [],
        size = 1;

    obj.init = function(param) {
        var _block = Block();
        _block.init(param);
        blocks.push(_block);
    }

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
        
    }

    obj.paint = function(canvas_context) {
        for (var i=0; i < blocks.length; i++) {
            blocks[i].paint(canvas_context);
        }
    }
    obj.head_position = function() {
        return blocks[0].getPosition();
    }

    obj.eat = function(t) {
        var _new_block = Block();
        var _last_block_pos = blocks[blocks.length - 1].getPosition();
        _new_block.init({
                            pos_x:_last_block_pos[0]-GameParameters.block_size,
                            pos_y: _last_block_pos[1], 
                            v_x: GameParameters.block_size, 
                            v_y: 0});
        size += 1;
        blocks.push(_new_block);
    }

    obj.goUp = function() {
        blocks[0].goUp();
    }
    obj.goDown = function() {
        blocks[0].goDown();
    }
    obj.goLeft = function() {
        blocks[0].goLeft();
    }
    obj.goRight = function() {
        blocks[0].goRight();
    }

    return obj;
});

var FoodList = (function() {
    var obj = {},
        list = [];
    obj.addFood = function(x, y) {
        var _newBlock = Block();
        _newBlock.init({pos_x:x, pos_y:y, v_x:0, v_y:0});
        list.push(_newBlock);
    }

    obj.removeFood = function(x, y) {
        for (var i=0; i < list.length; i++) {
            item_pos = list[i].getPosition();
            if (item_pos[0] == x && item_pos[1] == y) {
                list.splice(i, 1);
            }
        }
    }
    
    obj.paint = function(canvas_context) {
        for (var i=0; i < list.length; i++) {
            list[i].paint(canvas_context);
        }
    }
    return obj;

});

var Block = (function() {

    var obj = {},
        pos_x = 0,
        pos_y = 0,
        v_x = GameParameters.block_size,
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
        v_y = -1 * GameParameters.block_size;
        v_x = 0;
    }
    obj.goDown = function() {
        v_y = GameParameters.block_size;
        v_x = 0;
    }
    obj.goLeft = function() {
        v_x = -1 * GameParameters.block_size;
        v_y = 0;
    }
    obj.goRight = function() {
        v_x = GameParameters.block_size;
        v_y = 0;
    }
    obj.paint = function(canvas_context) {
        canvas_context.fillRect(pos_x, pos_y, GameParameters.block_size, GameParameters.block_size);
    }

    return obj;
});

function collisionDetection(snake, foodlist) {
    
    for (var i=0; i < list.length; i++) {
        item_pos = list[i].getPosition();
        if (item_pos[0] == head_position[0] && item_pos[1] == head_position[1]) {

        }
    }

}
draw("drawArea");
