// function isObj(obj:any){
//     return Object.prototype.toString.call(obj) === '[object Object]'
// }
// function flatten(obj){
//     let newObj = {};
//     function _flatten(prefix,suffix,obj){
//         Object.keys(obj).map(key => {
//             let item = obj[key];
//             if(isObj(item)) {
//                 _flatten(prefix+key+suffix+'.','',item)
//             } else if (Array.isArray(item)){
//                 _flatten(prefix+key+'['+suffix,']',item)
//             } else {
//                 newObj[`${prefix}${key}${suffix}`] = item;
//             }
//         })
//     }
//     _flatten('','',obj);
//     return newObj
// }
// console.log(flatten({
//     a: {
//            b: 1,
//            c: 2,
//            d: {e: [5]}
//        },
//     b: [1, 3, {a: 2, b: 3}],
//     c: 3
//    }))