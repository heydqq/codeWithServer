let obj = {'a':"b",34:null,arr:[1,2,3,undefined],c:Number(23),qq:{t:1,b:{c:3}},er:'undefined'}
let a = JSON.stringify(obj)
function turnToString(obj){
    if(Array.isArray(obj)){
        let str = '[';
        let arr = [];
        Object.keys(obj).map(key => {
            let value = obj[key];
            if (value === null || typeof value === 'undefined') {
                arr.push( `null`);
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                arr.push(`${value}`);
            } else if (typeof value === 'string') {
                arr.push( `"${value}"`);
            } else if(typeof obj[key] === 'object'){
                arr.push(`${turnToString(obj[key])}`)
            }
        })
        str += arr.join(',')
        str += ']'
        return str;
    } else if (typeof obj === 'object'){
        let string = '{';
        let arr = [];
        Object.keys(obj).map(key => {
            let value = obj[key];
            if (value === null) {
                arr.push( `"${key}":null`);
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                arr.push(`"${key}":${value}`);
            } else if (typeof value === 'string') {
                arr.push( `"${key}":"${value}"`);
            } else if (typeof value === 'undefined'){
            } else if(typeof obj[key] === 'object'){
                arr.push(`"${key}":${turnToString(obj[key])}`)
            }
        })
        string += arr.join(',')
        string += '}'
        return string;
    } else {
        if (obj === null) {
            return 'null';
        } else if (typeof obj === 'number' || typeof obj === 'boolean') {
            return `'${obj}'`
        } else if (typeof obj === 'string') {
           return obj
        } else if (typeof obj === 'undefined'){
            return undefined;
        }
    }
}