import Primise1 from '../components/promise1';
const promise = new Primise1((resolve, reject) => {
   resolve( 'success' )
   reject( 'err' )
})

promise.then(value => {
  console.log( 'resolve' , value)
}, reason => {
  console.log( 'reject' , reason)
})