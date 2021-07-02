import Promise1 from '../components/promise1';

var p1 = new Promise1((resolve)=>{setTimeout(()=>{return resolve(3);},1000)});
var p2 =Promise1.resolve(1);
var p3 =Promise1.resolve(2);
var p = Promise1.race([p1,p2,p3]);
p.then(e=>{console.log(e)});