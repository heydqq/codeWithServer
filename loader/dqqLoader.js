const parser = require('@babel/parser');
const traverse = require("@babel/traverse");
const types = require('@babel/types');
const generator = require("@babel/generator");
const utils = require('../utils/index');
function compile(source){
  let astTree = parser.parse(source,{
    sourceType:"module"
  });
  //utils.writeAst2File(astTree); //输出生成的ast树
  const visitor = {
    CallExpression(path){
      const { callee } = path.node;
      if(types.isCallExpression(path.node) && types.isMemberExpression(callee)){
        const {
          object,
          property
        } = callee;
        let args,argsLen;
        if(object.name === 'console' && property.name === 'log'){ //找到console log
          args = path.node.arguments;
          argsLen = args.length;
          const bodyDeclarationPath = path.parentPath.parentPath; //找到console的父节点的路径
          let bodyArray = bodyDeclarationPath.node.body; // 获取body数组
          //创建document.body.innerHTML 
          let innerhtml = types.memberExpression(types.identifier('document'),types.identifier('body'),false,false); //document.body
          innerhtml = types.memberExpression(innerhtml,types.identifier('innerHTML'),false,false); // document.body.innerHTML
          //创建 innerHTML 后面要拼接的参数
          let tempNode = null;
          for(let i = 0;i <= argsLen - 1;i++) { //每个参数中间加一个空格
            if(!tempNode) {
              tempNode = types.binaryExpression('+',args[i],types.stringLiteral('\t'));
            } else {
              tempNode = types.binaryExpression('+',tempNode,args[i]);
              tempNode = types.binaryExpression('+',tempNode,types.stringLiteral('\t'));
            }
          }
          tempNode = types.binaryExpression('+',tempNode,types.stringLiteral('</br>')); //最后加一个换行符
          let newNode = types.assignmentExpression('+=',innerhtml,tempNode);
          for(let i = 0;i<bodyArray.length;i++) {
            if(bodyArray[i] === path.parentPath.node) {
              bodyArray.splice(i+1,0,newNode);
              break;
            }
          }
        }
      }
    }
  }

  traverse.default(astTree,visitor);
  return generator.default(astTree,{},source).code;
}
module.exports = function(source){
  let newSource = compile(source);

  this.callback(null,newSource);

  return;
}