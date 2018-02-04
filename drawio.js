/* jshint esversion: 6 */

window.drawio = {
    shapes: [],
    pointx: [],
    pointy: [],
    undoBuffer: [],
    dragging: false,
    selectedShape: 'pen',
    ctx: document.getElementById('my-canvas').getContext('2d'),
    canvas: document.getElementById('my-canvas'),
    selectColor: '#000000',
    selectText: ' ',
    selectFont: 'Helvetica',
    selectFontSize: '36px',
    selectLineWith: 3,
    selectedElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text',
        PEN: 'pen',
        CLEAR: 'clear',
        REDO: 'redo',
        UNDO: 'undo'
    }
};

$(function() {
    //document is loaded and parsed
    $(".basic-color").spectrum({
        color: drawio.selectColor,
        change: function(color) {
            drawio.selectColor = color.toHexString();
        }
    });

    $('.lineWidth-item').click(function() {
        drawio.selectLineWith = $(this).text();
    });

    $('.font-item').click(function() {
        drawio.selectFont = $(this).text();
    });

    $('.fontSize-item').click(function() {
        drawio.selectFontSize = $(this).text();
    });

    $('#save').click(function() {
        console.log('save');
        localStorage.setItem('my-shapes', JSON.stringify(drawio.shapes));
        var lines = JSON.parse(localStorage.getItem(drawio.shapes));
    });

    $('#load').click(function() {

        console.log('load');
        var savedDrawio = JSON.parse(localStorage.getItem('my-shapes'));
        drawio.shapes = [];
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        for (let i = 0; i < savedDrawio.length; i++) {
            switch (savedDrawio[i].type) {
                case 'rectangle':
                    drawio.shapes.push(Object.assign(Object.create(Rectangle.prototype), savedDrawio[i]));
                    break;
                case 'circle':
                    drawio.shapes.push(Object.assign(Object.create(Circle.prototype), savedDrawio[i]));
                    break;
                case 'line':
                    drawio.shapes.push(Object.assign(Object.create(Line.prototype), savedDrawio[i]));
                    break;
                case 'text':
                    drawio.shapes.push(Object.assign(Object.create(Texxt.prototype), savedDrawio[i]));
                    break;
                case 'pen':
                    drawio.shapes.push(Object.assign(Object.create(Pen.prototype), savedDrawio[i]));
                    break;
            }
        }
        drawCanvas();
    });

    function drawCanvas() {
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
    }

    $('.shape').on('click', function() {
        $('.shape').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
        if (drawio.selectedShape == 'text') {
            $('#words').attr('type', 'text');
            drawio.selectText = ' ';
            var fullWord = "";
        } else {
            $('#words').attr('type', 'hidden');
        }
    });

    $('.action').on('click', function() {
        switch ($(this).data('shape')) {
            case 'undo':
                if (drawio.shapes.length > 0) {
                    drawio.undoBuffer.push(drawio.shapes.pop());
                    drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                    for (var i = 0; i < drawio.shapes.length; i++) {
                        drawio.shapes[i].render();
                    }
                }
                break;
            case 'redo':
                if (drawio.undoBuffer.length > 0) {
                    drawio.shapes.push(drawio.undoBuffer.pop());
                    drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                }
                for (var j = 0; j < drawio.shapes.length; j++) {
                    drawio.shapes[j].render();
                }
                break;
            case 'clear':
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawio.shapes = [];
                drawio.selectedElement = null;
                break;
        }
    });

    $('#my-canvas').on('mousedown', function(mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, 0, 0);
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, 0, 0);
                break;
            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, 0, 0, 0);
                break;
            case drawio.availableShapes.TEXT:
                var fullWord = $("#words").val();
                drawio.selectText = fullWord;
                drawio.selectedElement = new Texxt(drawio.selectText, {
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                }, drawio.selectFontSize, drawio.selectFont);
                break;
            case drawio.availableShapes.PEN:
                drawio.pointx.push(mouseEvent.offsetX);
                drawio.pointy.push(mouseEvent.offsetY);
                drawio.selectedElement = new Pen({
                    x: 0,
                    y: 0
                }, drawio.pointx, drawio.pointy);
                break;
        }
    });

    $('#my-canvas').on('mousemove', function(mouseEvent) {
        if (drawio.selectedElement) {
            if (drawio.selectedShape == 'pen') {
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
                drawio.pointx.push(mouseEvent.offsetX);
                drawio.pointy.push(mouseEvent.offsetY);

            } else {
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
                drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);

            }
        }
      drawCanvas();
    });

    $('#my-canvas').on('mouseup', function(mouseEvent) {
        if (drawio.selectedElement) {
            switch (drawio.selectedShape) {
                case 'text':
                    drawio.shapes.push(drawio.selectedElement);
                    break;
                case 'pen':
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.selectedElement = null;
                    drawio.pointx = [];
                    drawio.pointy = [];
                    break;
                default:
                    drawio.shapes.push(drawio.selectedElement);
                    drawio.selectedElement = null;
            }
        }
    });

    $('#my-canvas').on('mouseout', function(mouseEvent) {
        if (drawio.selectedShape == 'pen') {
            $('#my-canvas').mouseup();
        }
    });
});
