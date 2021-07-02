//https://mp.weixin.qq.com/s/lRFlFZ62_ndiuF7qO8ofZg
// 先定义三个常量表示状态
const PENDING =  'pending' ;
const FULFILLED =  'fulfilled';
const REJECTED =  'rejected';
let count = 0;
// 新建 MyPromise 类
class Promise1 {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try{
      executor(this.resolve, this.reject)
    } catch(err) {
      this.reject(err);
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  count = count++;
  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;
  onFulfilledCallback = [];
  onRejectedCallback = [];
  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;

      while (this.onFulfilledCallback.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallback.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      while (this.onRejectedCallback.length) {
        console.log(reason);
        this.onRejectedCallback.shift()(reason)
      }
    }
  }

  then(onFulfilled?, onRejected?) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason};


    // 判断状态
    let p2 = new Promise1((resolve,reject) => {
      if (this.status === FULFILLED) {
        //等待p2初始化完成，才能得到p2，实用微任务创建
        queueMicrotask(() => {

          try {
            const x = onFulfilled(this.value);
            resolvePromise(x,p2,resolve,reject);
          } catch(err) {
            reject(err);
          }
        })
      } else if (this.status === REJECTED) {
        // 调用失败回调，并且把原因返回
        queueMicrotask(() => {
          try{
            const x = onRejected(this.reason);
            resolvePromise(x,p2,resolve,reject);
          } catch(err) {
            reject(err);
          }
        })
      } else if (this.status === PENDING) {

        this.onFulfilledCallback.push(() => {
          queueMicrotask(() => {
            try{
              const x = onFulfilled(this.value);
              resolvePromise(x,p2,resolve,reject);
            }catch(err) {
              reject(err);
            }
          })
        })
        this.onRejectedCallback.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(x,p2,resolve,reject);
            } catch(err) {
              reject(err)
            }
          })
        })
      }
    })
    return p2;
  }

  static resolve (parameter?) {
    if(parameter instanceof Promise1) {
      return parameter;
    }
    return new Promise1((resolve) => {
      resolve(parameter);
    })
  }

  static all(promises) {
    let results = [];
    return new Promise1((resolve,reject) => {
      let count = 0,
          len = promises.length;
      for(let i = 0;i<len;i++) {
        Promise1.resolve(promises[i]).then(val => {
          results.push(val);
          count++;
          if(count === len) {
            return resolve(results);
          }
        },rea => {
          reject(rea)
        })
      }
    })
  }

  static race(promises) { 
    return new Promise1((resolve,reject) => {
      for(let i = 0;i<promises.length;i++) {
        Promise1.resolve(promises[i]).then(res=>{
          return resolve(res);
        },rea => {
          return reject(rea);
        })
      }
    })
  }

  static reject(reason?) {
    return new Promise1((resolve,reject) => {
      reject(reason);
    })
  }

}

function resolvePromise (x,p2,resolve,reject) {
  if(x === p2) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  /* 简陋版
  if(x instanceof Promise1) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
  */
  if(typeof x === 'object' || typeof x === 'function') {
    if(x === null) {
      return resolve(x);
    }
    let then;
    try{
      then = x.then;
    } catch(err) {
      return reject(err);
    }

    if(typeof then === 'function') {
      let called = false;
      try{
        then.call(x,
          y => {
            if(called) {
              return;
            }
            called = true;
            resolvePromise(y,p2,resolve,reject);
          },
          r => {
            if(called) {
              return;
            }
            called = true;
            reject(r);
          })
      } catch(err) {
        if(called) {
          return;
        }
        reject(err);
      }

    } else {
      resolve(x);
    }

  } else {
    resolve(x);
  }

}

export default Promise1;