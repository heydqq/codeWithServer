Function.prototype.myBind = function (context,...outerArgs) {
    let fn = Symbol();
    context[fn] = this;
    let _this = this;

    let result = function(...innerArgs){
        let args = [...outerArgs,...innerArgs];
        if(this instanceof _this) { //构造函数的情况
            this[fn] = _this;
            this[fn](...args);
            delete this[fn];
        } else {
            context[fn](...args);
            delete context[fn];
        }
    }
    // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
    // 实现继承的方式: 使用Object.create
    result.prototype = Object.create(_this.prototype)
    return result
}

function Person(name, age) {
  console.log(name); //'我是参数传进来的name'
  console.log(age); //'我是参数传进来的age'
  console.log(this); //构造函数this指向实例对象
}
// 构造函数原型的方法
Person.prototype.say = function() {
  console.log(123);
}
let obj = {
  objName: '我是obj传进来的name',
  objAge: '我是obj传进来的age'
}
// 普通函数
function normalFun(name, age) {
  console.log(name);   //'我是参数传进来的name'
  console.log(age);   //'我是参数传进来的age'
  console.log(this); //普通函数this指向绑定bind的第一个参数 也就是例子中的obj
  console.log(this.objName); //'我是obj传进来的name'
  console.log(this.objAge); //'我是obj传进来的age'
}

//先测试作为构造函数调用
// let bindFun = Person.myBind(obj, '我是参数传进来的name')
// let a = new bindFun('我是参数传进来的age')
// a.say() //123

//再测试作为普通函数调用
let bindFun = normalFun.myBind(obj, '我是参数传进来的name')
 bindFun('我是参数传进来的age')