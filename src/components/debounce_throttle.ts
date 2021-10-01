//防抖 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时
function debounce(fn,delay){
    let timer = null;
    return function(...args){
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        },delay)
    }
}
//节流 当持续触发事件时，保证一定时间段内只调用一次事件处理函数
//时间戳
function throttleByDate(fn,delay){
    let prev = new Date();
    return function(...args){
        let now = new Date()
        if((now - prev) >= delay){
            fn(...args);
            prev = new Date()
        }
    }
}
//定时器
function throttleByTimer(fn,delay){
    let flag = true;
    return function(...args){
        if(flag){
            flag = false;
            setTimeout(() => {
                fn(...args);
                flag = true;
            })
        }
    }
}
