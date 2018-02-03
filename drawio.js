
window.drawio = {
  shapes: [],
  pointx: [],
  pointy: [],
  undoBuffer: [],
  dragging: false,
  selectedShape: 'pen',
  ctx: document.getElementById('my-canvas').getContext('2d'),
  canvas: document.getElementById('my-canvas'),
  selectColor : '#000000',
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
    PEN:'pen',
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
          console.log(drawio.selectColor);
      }
  });

  $('.lineWidth-item').click(function(){
      drawio.selectLineWith = $(this).text();
      console.log($(this).text());
  });

  $('.font-item').click(function() {
      drawio.selectFont = $(this).text();
     console.log(drawio.selectFont);
  });

  $('.fontSize-item').click(function() {
      drawio.selectFontSize = $(this).text();
      console.log($(this).selectFontSize());
  });

  $('#save').click(function() {
    console.log('save');
    for (var i in drawio.shapes) {
      console.log(drawio.shapes[i]);
    }

  //  var imageData = drawio.ctx.getImageData(0,0,930,600);

    localStorage.setItem('my-shapes', JSON.stringify(drawio));
    console.log(JSON.stringify(drawio));
    //var lines = JSON.parse(localStorage.getItem(drawio.canvas));
  //  console.log(lines);

    //var idt = drawio.ctx.getImageData(0, 0, 930, 600);
    //localStorage.setItem('my-canvas', JSON.stringify(drawio.ctx));
    //localStorage.setItem('my-canvas', drawio.canvas.toDataURL());
    console.log(drawio.canvas);
  });
  console.log(drawio.shapes);

  $('#load').click(function() {

    console.log('load');
    var savedDrawio = JSON.parse(localStorage.getItem('my-shapes'));
    console.log(savedDrawio);
    for (var i in savedDrawio) {
      savedDrawio[i]
    }
//    drawio.shapes = Object.create()
  });

  function drawCanvas() {
    if (drawio.selectedElement) {
        drawio.selectedElement.render();
    }
    for (var i = 0; i < drawio.shapes.length; i++) {
      //if(drawio.shapes[i].render() != null){
          drawio.shapes[i].render();  //er að koma upp vesen
      //}
    }
  }

  $('.icon').on('click', function() {
    $('.icon').removeClass('selected');
    $(this).addClass('selected');
    drawio.selectedShape = $(this).data('shape');
    switch (drawio.selectedShape) {
        case drawio.availableShapes.TEXT:
            $('#words').attr('type', 'text');
            drawio.selectText = ' ';
            var fullWord = "";
        break;
        case drawio.availableShapes.UNDO:
            console.log('undo');
            drawio.undoBuffer.push(drawio.shapes.pop());
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);

            for (var i = 0; i < drawio.shapes.length; i++) {
              drawio.shapes[i].render();
            }
        break;
        case drawio.availableShapes.REDO:
            console.log('redo');
            drawio.shapes.push(drawio.undoBuffer.pop());
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);

            for (var j = 0; j < drawio.shapes.length; j++) {
              drawio.shapes[j].render();
            }
        break;
        case drawio.availableShapes.CLEAR:

            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.shapes = [];
        break;
        default:
            console.log('falið');
            $('#words').attr('type', 'hidden');
    }
  });

  //mousedown
  $('#my-canvas').on('mousedown', function (mouseEvent) {
    switch (drawio.selectedShape) {
      case drawio.availableShapes.RECTANGLE:
        drawio.selectedElement = new Rectangle({
          x: mouseEvent.offsetX,
          y: mouseEvent.offsetY
        }, 0, 0);
        break;
      case drawio.availableShapes.LINE:
        drawio.selectedElement = new Line ({
          x: mouseEvent.offsetX,
          y: mouseEvent.offsetY
        }, 0, 0);
        break;
      case drawio.availableShapes.CIRCLE:
          drawio.selectedElement = new Circle ({
            x: mouseEvent.offsetX,
            y: mouseEvent.offsetY
          }, 0, 0 ,0);
        break;
      case drawio.availableShapes.TEXT:
        var fullWord = $("#words").val();
        drawio.selectText = fullWord;
        drawio.selectedElement = new Texxt ( drawio.selectText ,{
          x: mouseEvent.offsetX,
          y: mouseEvent.offsetY
      }, drawio.selectFontSize, drawio.selectFont);
      break;
      case drawio.availableShapes.PEN:
        drawio.pointx.push(mouseEvent.offsetX);
        drawio.pointy.push(mouseEvent.offsetY);
        drawio.selectedElement = new Pen ({
          x: 0,
          y: 0
        }, drawio.pointx, drawio.pointy );
      break;
    }
  });


  //mousemove
  $('#my-canvas').on('mousemove', function (mouseEvent) {
    if(drawio.selectedElement) {
        if(drawio.selectedShape == 'pen'){
            console.log('pen');
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.pointx.push(mouseEvent.offsetX);
            drawio.pointy.push(mouseEvent.offsetY);
            drawCanvas();

          }
          else {
            console.log('not pen');
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
          }
    }
  });

  // mouseup
  $('#my-canvas').on('mouseup', function (mouseEvent) {
      if(drawio.selectedElement) {
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
});
