/**
  defin the shapes
*/

//öll önnur föll eiga erfa
function Shape(position) {
  this.position = position;
};

Shape.prototype.render = function () {};

Shape.prototype.move = function(position) {
  this.position = position;
};

//regtengl mun fa sina eigin af resize
Shape.prototype.resize = function () {};

function Rectangle(position, width, height) {
  Shape.call(this, position);
  this.width = width;
  this.height = height;
};

// assign the prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

//bara út filltir vantar fyrir ekki utfilta
Rectangle.prototype.render = function () { // er i fucki ef það er ekki fillRect
  //render a Rectangle
  drawio.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

  //drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};

Rectangle.prototype.resize = function (x, y) {
  this.width = x - this.position.x;
  this.height = y - this.position.y;
};

function Circle(position, radios) {
  Shape.call(this, position);
  this.radios = radios;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
  drawio.ctx.beginPath();
  drawio.ctx.arc(this.position.x, this.position.y, this.radios , 0,  Math.PI * 2);
  drawio.ctx.fill();
  drawio.ctx.stroke();
  drawio.ctx.closePath();
};

Circle.prototype.resize = function (radios) {
  this.radios = 50; //kann ekki
};

function Line(position, xMoved, yMoved) { //virkar ekki
  Shape.call(this, position);
  this.yMoved = xMoved;
  this.yMoved = yMoved;
};

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
  drawio.cxt.strokeStyle = "#df4b26";
  drawio.ctx.lineWidth = 5;
  drawio.ctc.beginPath();
  drawio.ctx.moveTo(this.position.x, this.position.y);
  drawio.ctx.lineTo(this.xMoved, this.yMoved);
  drawio.ctx.stroke();
  drawio.ctx.closePath();

};

Line.prototype.resize = function (x, y) {
  this.xMoved =  x;
  this.yMoved = y;

};

function Texxt(text, position, width) {
  this.text = 'Hallo';
  Shape.call(this, position);
  this.width = width;
}

Texxt.prototype = Object.create(Shape.prototype);
Texxt.prototype.constructor = Texxt;

Texxt.prototype.render = function () {
  drawio.ctx.font = '30px Helvetica';
  drawio.ctx.fillText(this.text , this.position.x, this.position.y, this.width);

};

Texxt.prototype.resize = function (x, y) {
  this.width = x - this.position.x;
};
