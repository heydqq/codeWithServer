Function.prototype.myCall = function(context){
    if(typeof this !== 'function'){
        throw new TypeError('this is not a function');
    }
    context = ( context === null || context === undefined ) ? window : new Object(context);
    let fn = Symbol();
    context[fn] = this;
    console.log(arguments)
    let arg = [...arguments].slice(1);
    context[fn](arg)
    delete context[fn];
}

Function.prototype.myApply = function(context){
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let arg = [...arguments].slice(1);
    context[fn](arg)
    delete context[fn];
}

// 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
Function.prototype.myBind = function(context){
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    let params = [].slice.call(arguments,1);
    let _this = this;
    let fBound = function () {
        let newParams = params.concat(Array.from(arguments));
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        let fContext = this instanceof fBound ? this : context;
        return _this.apply(fContext,newParams)
    }
    fBound.prototype = _this.prototype;
    return fBound
}

var value = 2;

var foo = {
        value: 1
    };
    
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

// var bindFoo = bar.myBind1(foo, 'daisy');
// bindFoo('18');
var bindFoo = bar.myBind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin

