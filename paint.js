
var context = document.getElementById('my-canvas').getContext('2d');

$('#my-canvas').mousedown(function(e) {
  var mosueX = e.pageX - this.offsetLeft; //Why*???
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#my-canvas').mousemove(function(e) {
  if (paint) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#my-canvas').mouseup(function (e) {
  paint = false;
});

$('#my-canvas').mouseleave(function (e) {
  paint = false;
});

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }
     else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}
//http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#demo-tools
