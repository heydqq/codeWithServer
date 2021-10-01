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

let Person = {
    name:'dqq',
    say(age){
        console.log(`我叫${this.name},我今年${age}岁`);
    }
}

let person1 = {
    name:'sxd'
}

let fn = Person.say.myCall(person1,12);
console.log(person1,Person)