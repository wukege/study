/**
 * Created by kege on 2017/5/15.
 */
//import './test.scss'
//import test from './test.vue';
//exports.alert = function(){
//  //alert(1)
//};

//export var foo = 'bar';
//
//setTimeout(()=>{
//  foo = 'baz';
//},500);
//


var obj = {
  nameA:'a'
};

var obj1 = {
  nameB:'B',
  nameA:'aaa'
};

console.dir(Object.assign(obj,obj1));