/**
 * Created by kege on 2017/6/2.
 */
//创建一个类
var Person = function () {
  //属性：姓名，注意要属性名与get和set的名称不能重复否则会报错
  this._username = 'unknown';
  this._age = 0;
};
//在原型中给set和get方法
//在原型中get和set方法的名称是一样的，方便调用
Person.prototype = {
  set username(name) {
    console.log('调用username的set方法');
    this._username = name;
  },
  get username() {
    console.log('调用了username的get方法');
    return this._username;
  }
};

var p = new Person();
p.username;
p.username = 'foo';


var log = ['test'];
var obj = {
  get latest () {
    if (log.length == 0) return undefined;
    return log[log.length - 1]
  }
};
console.log (obj.latest); // Will return "test".