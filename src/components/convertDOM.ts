let obj = {
    tag: 'DIV',
    attrs:{
        id:'app'
    },
    children: [
      {
        tag: 'SPAN',
        children: [
          { tag: 'A', children: [] }
        ]
      },
      {
        tag: 'SPAN',
        children: [
          { tag: 'A', children: [] },
          { tag: 'A', children: [] }
        ]
      },
      333,
      "3434"
    ]
  };
//   把上诉虚拟Dom转化成下方真实Dom
//   <div id="app">
//     <span>
//       <a></a>
//     </span>
//     <span>
//       <a></a>
//       <a></a>
//     </span>
//   </div>

function convertDOM(obj){
    if(typeof obj === 'number'){
        obj = String(obj);
    }
    if(typeof obj === 'string'){
        return document.createTextNode(obj);
    }
    let childrenArr = [];
    for(let i = 0;i<obj.children.length;i++){
        childrenArr.push(convertDOM(obj.children[i]))
    }
    let dom = document.createElement(obj.tag);
    if(obj.attrs){
        Object.keys(obj.attrs).forEach((key) => {
            dom.setAttribute(key,obj.attrs[key]);
        })
    }
    for(let i = 0;i<childrenArr.length;i++){
        dom.appendChild(childrenArr[i]);
    }
    return dom;
}

let ans = convertDOM(obj)
console.log(ans)