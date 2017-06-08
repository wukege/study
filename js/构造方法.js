
/**
 * Created by kege on 2017/6/2.
 */
//创建一个Shape类
function Shape(){
  this.x = 0;
  this.y = 0;
}
//在类的原型上添加一个move方法
Shape.prototype.move = function(x,y){
  this.x += x;
  this.y += y;
  console.log(this.x,this.y);
  console.log("Shape moved.");
};
//创建一个Rectangle类并继承Shape类
function Rectangle(){
  Shape.call(this);
}
//把Shape.prototype原型上的属性和方法继承到Rectangle.prototype原型上
Rectangle.prototype = Object.create(Shape.prototype);

//创建一个类
class Shape1{
  constructor(){
    this.x = 0;
    this.y = 0;
  }
  //在类的原型上添加一个move方法
  move (x,y){
    this.x += x;
    this.y += y;
    console.log(x,y);
  }
}


//创建一个Rectangle类并继承Shape类
class Rectangle1 extends Shape1{
  constructor(c){
    super();//调用父类的constructor(x, y)实现继承
    this.color = c;
  }

  getColor (){
    console.log(this.color);
  }
}
console.dir(Rectangle1);
console.dir(Rectangle);
var rect = new Rectangle();
var o = new Rectangle1('红色');
//o.move(2,2);
o.getColor();

//Object.assign Object.create() Object.defineProperty