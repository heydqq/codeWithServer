const shallowClone = (source) => {
    if(typeof(source) !== 'object' || source === null){
        return source;
    }
    let obj = Array.isArray(source) ? [] : {};
    for(let key in source){
        obj[key] = source[key];
    }
    return obj;
}
//{ a:[1,2,3] , b:{c:223,d:34} }
const deepClone = (source) => {
    if(typeof(source) !== 'object' || source === null){
        return source;
    }
    let obj = Array.isArray(source) ? [] : {};
    for(let key in source){
        if(source[key] === source){
            continue;
        }
        obj[key] = deepClone(source[key]);
    }
    return obj;
}

export {
    shallowClone,
    deepClone
};