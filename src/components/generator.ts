function generat(params) {
    let count = -1;
    return {
        next:function () {
            count++;
            if(count <= params.length - 1){
                return {
                    value:params[count],
                    done:false
                }
            } else {
                return {
                    value:undefined,
                    done:true
                }
            }
        }
    } 
}
let a = generat([1,2,3,4])
let b;
while(true){
    b = a.next();
    console.log(b);
    if(b.done === true){
        break;
    }
}

function asyncFunction(func) {
    let generat = func();
    let next = (data) => {
        let res = generat.next(data);

        if(!res.done){
            res.value.then(result => {
                next(result);
            });
        }
    }
    next('')
}

function *func(){
    let res1 = yield aa();
    console.log(res1);
    let res2 = yield aa();
    console.log(res2);
    let res3 = yield aa();
    console.log(res3);
}

function aa() {
    return new Promise((reolve,reject) => {
        setTimeout(() => {
            reolve(Math.random())
        },1000);
    })
}
asyncFunction(func)