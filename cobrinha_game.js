function draw(elementID) {
    var canvas_elem = document.getElementById(elementID);
    var canvas_context = canvas_elem.getContext("2d");
    //canvas_context.fillRect(0, 0, 800, 300);
    //canvas_context.strokeRect(0, 0, 800, 300);
    window.setInterval( function() {
        canvas_elem.width = canvas_elem.width;
        now = bloco.iterate();
        canvas_context.fillRect(now.pos_x, now.pos_y, 5, 5);
    }, 200);


    $(document).keyup( function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        console.log(code);
        switch(code) {
            case 37:
                bloco.goLeft();
                return false;
            case 39:
                bloco.goRight();
                return false;
            case 38:
                bloco.goUp();
                return false;
            case 40:
                bloco.goDown();
                return false;
        }
    });
    //canvas_context = fillRect(
    //canvas_context.lineTo(200.5, 250);
    //canvas_context.lineTo(250, 10);

    //canvas_context.strokeStyle = "#000000";
    //canvas_context.stroke();
}

var bloco = (function() {

    var obj = {},
        pos_x = 0,
        pos_y = 0,
        v_x = 5,
        v_y = 0;

    obj.iterate = function() {
        pos_x += v_x;
        pos_y += v_y;
        result = {};
        result.pos_x = pos_x;
        result.pos_y = pos_y;
        return result;
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
}());


draw("drawArea");
