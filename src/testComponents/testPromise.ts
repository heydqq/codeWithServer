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
        resolve('成功了')

    },1000)
})
  
let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    },500) 
})
let p3 = MyPromise.reject('失败')
MyPromise.race([p1, p2,p3]).then((result) => {
    console.log('resolve:',result)
}).catch((error) => {
    console.log('reject:',error)
})
//百思不得其解的题目
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



//测试九、实现 resolve 与 reject 的静态调用
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
//测试八、then 中的参数变为可选
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

//测试七、参考 fulfilled 状态下的处理方式，对 rejected 和 pending 状态进行改造
// 增加异步状态下的链式调用
// 增加回调函数执行结果的判断
// 增加识别 Promise 是否返回自己
// 增加错误捕获
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
//测试六、捕获错误及 then 链式调用其他状态代码补充
//1、执行器错误
// const mypromise = new MyPromise((resolve, reject) => {
//     throw new Error('执行器错误')
// })
// mypromise.then(value => {
//     console.log(1)
//     console.log('mypromise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('mypromise>>',reason.message)
// })
// const promise = new Promise((resolve, reject) => {
//     throw new Error('执行器错误')
// })
// promise.then(value => {
//     console.log(1)
//     console.log('promise>>', value)
// }, reason => {
//     console.log(2)
//     console.log('promise>>',reason.message)
// })
//2、then执行错误
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
//测试五、then 方法链式调用识别 Promise 是否返回自己
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

//测试四、实现then方法的链式调用
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

//测试三、实现then多次调用
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

//测试二、增加异步处理
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

//测试 一，简单逻辑实现
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