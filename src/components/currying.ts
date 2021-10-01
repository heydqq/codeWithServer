let curryWeight = function(fn){
    let _fishWight = [];
    function _addWight(){
        _fishWight.push(...arguments);
        return _addWight;
    }
    _addWight.toString = function(){
        return fn(_fishWight)
    }
    return _addWight;
}

let addWeight = curryWeight(function(){
    let arr = [].slice.call(...arguments);
    console.log(arr);
    return arr.reduce((a,b) => {
        return a+b;
    })
})


function createCurrying(fn,arg?){
    let totalLen = fn.length;
    let args = arg || [];
    return function (){
        let _args = [...arguments,...args];
        if(_args.length < totalLen){
            return createCurrying.call(this,fn,_args);
        }
        console.log(_args);
        return fn.apply(this,_args);
    }
}

let _check = createCurrying(function check(targetString, reg) {
    return reg.test(targetString);
});

let checkPhone = _check(/^1[34578]\d{9}$/);
console.log(checkPhone('18388888888'));
console.log(checkPhone('174883838383'));
