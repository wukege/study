import {foo} from './test.js';

//a.alert();

console.log(foo);

setTimeout(()=>{
  console.log(foo)
},1500);