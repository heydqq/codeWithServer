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

Function.prototype.myBind = function(context) {
    let self = this;
    let arg = [...arguments].slice(1);
    return function() {
        let args = [...arguments].concat(arg);
        return self.myApply(context,args);
    };
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