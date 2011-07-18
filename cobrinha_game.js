function draw(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
    //canvas_context.fillRect(0, 0, 800, 300);
    //canvas_context.strokeRect(0, 0, 800, 300);
    //bloco = Block();
    //bloco.init({pos_x: 40, pos_y: 40, v_x: -5, v_y: 0});
    
    snake = Snake();
    snake.init({pos_x: 40, pos_y: 40, v_x: 5, v_y: 0});
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    snake.eat();
    window.setInterval( function() {
        canvas_elem.width = canvas_elem.width;
        now = snake.iterate();
        for (var i=0; i < now.length; i++) {
            canvas_context.fillRect(now[i].pos_x, now[i].pos_y, 5, 5);
        }
    }, 200);


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
    //canvas_context = fillRect(
    //canvas_context.lineTo(200.5, 250);
    //canvas_context.lineTo(250, 10);

    //canvas_context.strokeStyle = "#000000";
    //canvas_context.stroke();
}

var Snake = (function() {
    var obj = {};
    obj.blocks = [];
    obj.size = 1;

    obj.init = function(param) {
        var _block = Block();
        _block.init(param);
        obj.blocks.push(_block);
    }

    obj.iterate = function() {
        var result = [];

        for (var i=0; i < obj.blocks.length; i++) {
            var now = obj.blocks[i].iterate();
            result.push(now);
        }        
        
        // Update speeds
        for (i=obj.blocks.length-1; i > 0; i--) {
            prev_block_speed = obj.blocks[i-1].getSpeed();
            obj.blocks[i].setSpeed(prev_block_speed[0], prev_block_speed[1]);
        }
        return result;
    }

    obj.eat = function(t) {
        var _new_block = Block();
        var _last_block_pos = obj.blocks[obj.blocks.length - 1].getPosition();
        _new_block.init({pos_x:_last_block_pos[0]-5, pos_y: _last_block_pos[1], v_x: 5, v_y: 0});
        obj.size += 1;
        obj.blocks.push(_new_block);
    }

    obj.goUp = function() {
        obj.blocks[0].goUp();
    }
    obj.goDown = function() {
        obj.blocks[0].goDown();
    }
    obj.goLeft = function() {
        obj.blocks[0].goLeft();
    }
    obj.goRight = function() {
        obj.blocks[0].goRight();
    }

    return obj;
});

var Block = (function() {

    var obj = {},
        pos_x = 0,
        pos_y = 0,
        v_x = 5,
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
        v_y = -5;
        v_x = 0;
    }
    obj.goDown = function() {
        v_y = 5;
        v_x = 0;
    }
    obj.goLeft = function() {
        v_x = -5;
        v_y = 0;
    }
    obj.goRight = function() {
        v_x = 5;
        v_y = 0;
    }

    return obj;
});


draw("drawArea");
