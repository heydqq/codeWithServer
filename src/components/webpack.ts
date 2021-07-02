// function require1(file){ //reuqire逻辑
//     let exports = {};
//     (
//         function(exports,code){
//             eval(code);
//         }
//     )(exports,'exports.default = function(a,b){return a + b}');
//     return exports;
// }

// let add = require1('add.js').default;
// console.log(add(1,2));

//模拟入口模块文件
(function(list){
    function require1(file){
        let exports = {};
        (function (exports,code){
            eval(code);
        })(exports,list[file]);
        return exports;
    }
    require1('index.js');
})({
    'index.js':`
    var add = require1('add.js').default
    console.log(add(4 , 5))
        `,
    'add.js':`exports.default = function(a,b){return a + b}`
})