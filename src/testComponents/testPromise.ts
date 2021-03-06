const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
//https://juejin.cn/post/6945319439772434469#heading-19
class MyPromise {
    constructor(func) {
        try{
            func(this._resolve,this._reject);
        } catch(err){
            this._reject(err);
        }
    }

    status=PENDING;
    value=null;
    reason = null;
    fulfilledCallbacks=[];
    rejectedCallbacks=[];
    _resolve = (value) => {
        if(this.status !== PENDING){
            return;
        }
        this.status = FULFILLED
        this.value = value;
        this.fulfilledCallbacks.forEach(item => item(value));
    }

    _reject = (reason) => {
        if(this.status !== PENDING){
            return;
        }
        this.status = REJECTED
        this.reason = reason;
        this.rejectedCallbacks.forEach(item => item(reason));
    }

    then(resolve?,reject?){
        let _resolve = typeof resolve === 'function' ? resolve : val=>val;
        let _reject = typeof reject === 'function' ? reject : reason => {throw reason};
        let p1 = new MyPromise((res,rej) => {
            if(this.status === FULFILLED){
                queueMicrotask(() => {
                    try{
                        const x = _resolve(this.value);
                        this._resolvePromise(p1,x,res,rej);
                    }catch(err){
                        rej(err);
                    }
                })
            } else if (this.status === REJECTED){
                queueMicrotask(() => {
                    try{
                        const x = _reject(this.reason);
                        this._resolvePromise(p1,x,res,rej);
                    }catch(err){
                        rej(err);
                    }
                })
            } else if(this.status === PENDING){
                this.fulfilledCallbacks.push(() => {
                    queueMicrotask(() => {
                        try{
                            const x = _resolve(this.value);
                            this._resolvePromise(p1,x,res,rej);
                        }catch(err){
                            rej(err);
                        }
                    })
                });
                this.rejectedCallbacks.push(() => {
                    queueMicrotask(() => {
                        try{
                            const x = _reject(this.reason);
                            this._resolvePromise(p1,x,res,rej);
                        }catch(err){
                            rej(err);
                        }
                    })
                });
            }
        })
        return p1;
    }
    catch(fn){
        return this.then(null,fn);
    }
    _resolvePromise = function (promise1,x,resolve,reject) {
        if(promise1 === x) {
            return reject(new Error('Chaining cycle detected for mypromise #<MyPromise>'))
        }
        if(x instanceof MyPromise){
            x.then(resolve,reject);
        } else {
            resolve(x);
        }
    }
    static resolve(val?){
        if(val instanceof MyPromise){
            return val;
        }
        return new MyPromise((resolve,reject) =>{
            resolve(val);
        })
    }

    static reject(reason?){
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }

    static race(promises){
        return new MyPromise((resolve,reject) => {
            for(let promise of promises){
                promise.then(resolve,reject);
            }
        })
    }

    static all(promises){
        return new MyPromise((resolve,reject)=>{
            let count = 0;
            let ans = new Array(promises.length);
            for(let i =0;i<promises.length;i++){
                promises[i].then(res => {
                    ans[i]=res;
                    count++;
                    if(count === promises.length){
                        resolve(ans);
                    }
                },err=>{
                    reject(err);
                })
            }
        })
    }

}


let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('?????????')

    },1000)
})
  
let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    },500) 
})
let p3 = MyPromise.reject('??????')
MyPromise.race([p1, p2,p3]).then((result) => {
    console.log('resolve:',result)
}).catch((error) => {
    console.log('reject:',error)
})
//???????????????????????????
// MyPromise.resolve().then(() => {
//     console.log(0);
//     return MyPromise.resolve(4);
// }).then((res) => {
//     console.log(res)
// })

// MyPromise.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// }).then(() =>{
//     console.log(6);
// })



//?????????????????? resolve ??? reject ???????????????
// Promise.resolve().then((res) =>{
//     console.log(0);
//     console.log('promise>>',res);
//     return Promise.resolve(4);
// }).then(res =>{
//     console.log('promise>>',res);
// })
// MyPromise.resolve().then((res) =>{
//     console.log(0);
//     console.log('mypromise>>',res);
//     return MyPromise.resolve(4);
// }).then(res =>{
//     console.log('mypromise>>',res);
// })
//????????????then ????????????????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     setTimeout(() => {
//         reject(100);
//     })
// })
// mypromise
//     .then()
//     .then()
//     .then(
//         val => console.log('mypromise.resolve>>',val),
//         // reason => console.log('mypromise.reject>>',reason),
//     )
// const promise = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         reject(100);
//     })
// })
// promise
//     .then()
//     .then()
//     .then(
//         val => console.log('promise>>',val),
//         // reason => console.log('promise.reject>>',reason),
//     )

//?????????????????? fulfilled ?????????????????????????????? rejected ??? pending ??????????????????
// ????????????????????????????????????
// ???????????????????????????????????????
// ???????????? Promise ??????????????????
// ??????????????????
// const mypromise = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         reject('fail');
//     },1000)
// })
// mypromise.then(value => {
//     console.log(1)
//     console.log('mypromise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('mypromise>>',reason)
// }).then(value => {
//     console.log(3)
//     console.log('mypromise>>', value)
// }, reason => {
//     console.log(4)
//     console.log('mypromise>>',reason)
// })
// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('fail');
//     },1000)
// })
// promise.then(value => {
//     console.log(1)
//     console.log('promise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('promise>>',reason)
// }).then(value => {
//     console.log(3)
//     console.log('promise>>', value)
// }, reason => {
//     console.log(4)
//     console.log('promise>>',reason)
// })
//??????????????????????????? then ????????????????????????????????????
//1??????????????????
// const mypromise = new MyPromise((resolve, reject) => {
//     throw new Error('???????????????')
// })
// mypromise.then(value => {
//     console.log(1)
//     console.log('mypromise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('mypromise>>',reason.message)
// })
// const promise = new Promise((resolve, reject) => {
//     throw new Error('???????????????')
// })
// promise.then(value => {
//     console.log(1)
//     console.log('promise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('promise>>',reason.message)
// })
//2???then????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     resolve('success');
// })
// mypromise.then(res => {
//     console.log(1)
//     console.log('mypromise.resolve>>', res)
//     throw new Error('then err');
// }).then(res=>{
//     console.log(2)
//     console.log('mypromise.resolve>>', res)
// },err =>{
//     console.log(3)
//     console.log('mypromise.reject>>', err)
// })
// const promise = new Promise((resolve,reject) => {
//     resolve('success');
// })
// promise.then(res => {
//     console.log(1)
//     console.log('promise.resolve>>', res)
//     throw new Error('then err');
// }).then(res=>{
//     console.log(2)
//     console.log('promise.resolve>>', res)
// },err =>{
//     console.log(3)
//     console.log('promise.reject>>', err)
// })
//????????????then ???????????????????????? Promise ??????????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     resolve('success');
// })
// const myp1 = mypromise.then(value => {
//     console.log(1)
//     console.log('mypromise.resolve>>', value)
//     return myp1;
// })
// myp1.then(val => {
//     console.log(2);
//     console.log('mypromise>>',val)
// },rea =>{
//     console.log(3);
//     console.log('mypromise>>',rea)
// })
// const promise = new Promise((resolve,reject) => {
//     resolve('success');
// })
// const p1 = promise.then(value => {
//     console.log(1)
//     console.log('promise.resolve>>', value)
//     return p1;
// })
// p1.then(val => {
//     console.log(2);
//     console.log('mypromise>>',val)
// },rea =>{
//     console.log(3);
//     console.log('mypromise>>',rea)
// })

//??????????????????then?????????????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     resolve('success');
// })
// function myother () {
//     return new MyPromise((resolve, reject) =>{
//         resolve('other')
//     })
// }
// mypromise.then(value => {
//     console.log(1)
//     console.log('mypromise.resolve>>',value);
//     return myother()
// }).then(value => {
//     console.log(2)
//     console.log('mypromise.resolve>>', value)
//     return value;
// }).then(res=>{
//     console.log('mypromise.then>>',res)
// })
// const promise = new Promise((resolve,reject) => {
//     resolve('success');
// })
// function other () {
//     return new Promise((resolve, reject) =>{
//         resolve('other')
//     })
// }
// promise.then(value => {
//     console.log(1)
//     console.log('promise.resolve>>', value)
//     return other();
// }).then(value => {
//     console.log(2)
//     console.log('promise.resolve>>', value)
//     return value;
// }).then(res =>{
//     console.log('then finally:',res);
// })

//??????????????????then????????????
// const promise = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         resolve('success');
//     },2000)
// })
// promise.then(value => {
//     console.log(1);
//     console.log('promise>>',value);
// },reason => {
//     console.log(1);
//     console.log('promise>>',reason);
// })
// promise.then(value => {
//     console.log(2);
//     console.log('promise>>',value);
// },reason => {
//     console.log(2);
//     console.log('promise>>',reason);
// })

// const mypromise = new MyPromise((resolve,reject) => {
//     setTimeout(() => {
//         resolve('success');
//     },2000)
// })
// mypromise.then(value => {
//     console.log(1);
//     console.log('mypromise>>',value);
// },reason => {
//     console.log(1);
//     console.log('mypromise>>',reason);
// })
// mypromise.then(value => {
//     console.log(2);
//     console.log('mypromise>>',value);
// },reason => {
//     console.log(2);
//     console.log('mypromise>>',reason);
// })

//??????????????????????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     setTimeout(() => {
//         resolve('success');
//     },2000)
// })
// mypromise.then(value => {
//     console.log('mypromise>>',value);
// },reason => {
//     console.log('mypromise>>',reason);
// })
// const promise = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         resolve('success');
//     },2000)
// })
// promise.then(value => {
//     console.log('promise>>',value);
// },reason => {
//     console.log('promise>>',reason);
// })

//?????? ????????????????????????
// const mypromise = new MyPromise((resolve,reject) => {
//     resolve('success');
//     reject('err');
// })
// mypromise.then(value => {
//     console.log('mypromise>>',value);
// },reason => {
//     console.log('mypromise>>',reason);
// })
// const promise = new Promise((resolve,reject) => {
//     resolve('success');
//     reject('err');
// })
// promise.then(value => {
//     console.log('promise>>',value);
// },reason => {
//     console.log('promise>>',reason);
// })