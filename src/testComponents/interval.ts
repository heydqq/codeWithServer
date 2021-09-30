function myInterval(fn,ms){
    let timer = null,
        clear = false;
    function innerInterval(){
        if(clear){
            clearTimeout(timer);
            return;
        }
        fn();
        timer = setTimeout(innerInterval,ms);
    }

    timer = setTimeout(innerInterval,ms)

    return () => {
        clear = true;
    }
}

let can = myInterval(() => {
    console.log('sfsdf')
},1000)

setTimeout(() => {
    can()
},4500)