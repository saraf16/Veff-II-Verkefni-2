
function Shape(position) {
  this.position = position;
  this.color = drawio.selectColor;
  this.lineWidth = drawio.selectLineWith;
}

Shape.prototype.render = function () {};

Shape.prototype.move = function(position) {
  this.position = position;
};

//regtengl mun fa sina eigin af resize
Shape.prototype.resize = function () {};

function Rectangle(position, width, height) {
  Shape.call(this, position, this.color, this.lineWidth);
  this.width = width;
  this.height = height;
}

// assign the prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

//bara út filltir vantar fyrir ekki utfilta
Rectangle.prototype.render = function () {
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;
  drawio.ctx.beginPath();
  drawio.ctx.rect(this.position.x, this.position.y, this.width, this.height);
  drawio.ctx.stroke();
  drawio.ctx.closePath();

};

Rectangle.prototype.resize = function (x, y) {
  this.width = x - this.position.x;
  this.height = y - this.position.y;
};

function Circle(position, radius) {
  Shape.call(this, position, this.color, this.lineWidth);
  this.radius = radius;
  console.log(radius);
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;
  drawio.ctx.beginPath();
  // tek absolute value af radius til að geta gert hring í báðar áttir
  drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.radius), 0, Math.PI * 2, true);//  drawio.ctx.fill();
  drawio.ctx.stroke();
  drawio.ctx.closePath();
};

Circle.prototype.resize = function (x) {
  this.radius = x - this.position.x;
};

function Line(position, xMoved, yMoved) {
  Shape.call(this, position, this.color, this.lineWidth);
  this.yMoved = xMoved;
  this.yMoved = yMoved;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;
  drawio.ctx.beginPath();
  drawio.ctx.moveTo(this.position.x, this.position.y);
  drawio.ctx.lineTo(this.xMoved, this.yMoved);
  drawio.ctx.stroke();
  drawio.ctx.closePath();

};

Line.prototype.resize = function (x, y) {
  this.xMoved =  x;
  this.yMoved = y;

};

function Texxt(text, position, fontSize, font) {
  this.text = text;
  Shape.call(this, position, this.color);
  this.fontSize = fontSize;
  this.font = font;
}

Texxt.prototype = Object.create(Shape.prototype);
Texxt.prototype.constructor = Texxt;

Texxt.prototype.render = function () {
    drawio.ctx.fillStyle = this.color;
    var res = this.fontSize + this.font;
    console.log(res);
    drawio.ctx.font = res;
    drawio.ctx.fillText(this.text , this.position.x, this.position.y,  930);
};


function Pen(position, xMoved, yMoved) {
  Shape.call(this, position, this.color, this.lineWidth);
  this.xMoved = xMoved;
  this.yMoved = yMoved;
}

Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;

Pen.prototype.render = function () {
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;

  drawio.ctx.beginPath();
  drawio.ctx.moveTo(this.xMoved[0], this.yMoved[0]);
  for (var i = 1; i <= this.xMoved.length; i++) {
     drawio.ctx.lineTo(this.xMoved[i], this.yMoved[i]);
  }
  drawio.ctx.stroke();
  drawio.ctx.closePath();

};
