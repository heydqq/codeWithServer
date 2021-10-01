function fn(number){
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(number*2)
      },1000)
    });
  }
  
  function *gen(){
    let number = yield fn(1);
    console.log(number)
    number = yield fn(3);
    console.log(number)
    number = yield fn(5);
    console.log(number)
    return number;
  }
  
  function generatorToAsync(gen){
    let a = gen();
    return function(){
      return new Promise((resolve,reject) => {
        go('next',null);
        function go(key,value){
          let res;
          try{
            res = a[key](value)
          } catch(err){
            return reject(err);
          }
          const {
            done,
            value:val
          } = res;
          if(done){
            return resolve(val);
          } else {
            return Promise.resolve(val).then(res => go('next',res),err =>go('err',err));
          }
        }
      })
    }
  }
  const asyncFn = generatorToAsync(gen)
  
  console.log(asyncFn()) // Promise
  // async function asyncFn() {
  //   let x1 = await fn(1);
  //   console.log(x1);
  //   let x2 = await fn(x1);
  //   console.log(x2);
  //   let x3 = await fn(x2);
  //   console.log(x3)
  //   return x3;
  // }
  // asyncFn()