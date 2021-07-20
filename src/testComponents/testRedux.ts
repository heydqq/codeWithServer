import { createStore,
    applyMiddleware,
    combineReducers } from './components/redux';

const test1 = function (state = 0,action){
    switch (action.type){
        case 'change':
            return action.payload;
        case 'add':
            return state + 1;
        case 'minus':
            return state - 1;
        default:
            return state;
    }
}

const test2 = function(state = true,action) {
    switch(action.type){
        case 'toggle':
            return !state;
        default:
            return state;
    }
}

let reducers = combineReducers({
    test1,
    test2
})

let logger1 = (middlerWareAPI:any) => {
    return (next) => {
        console.log('next1.next:',next);
        return action => {
            console.log('next1.action:',action)
            console.log('logger1 start');
            let result = next(action);
            console.log('logger2 end')
            return result;
        }
    }
}

let logger2 = (middlerWareAPI:any) => {
    return (next) => {
        console.log('next2.next:',next);
        return action => {
            console.log('next2.action:',action)
            console.log('logger2 start');
            let result = next(action);
            console.log('logger2 end')
            return result;
        }
    }
}
let logger3 = (middlerWareAPI:any) => {
    return (next) => {
        console.log('next3.next:',next);
        return action => {
            console.log('next3.action:',action)
            console.log('logger3 start');
            let result = next(action);
            console.log('logger3 end')
            return result;
        }
    }
}
let enhancer = applyMiddleware(logger1,logger2,logger3);
let store = createStore(reducers,null,enhancer);

setTimeout(() => {
    store.dispatch({
        type:'add'
    })
},2000)

// setTimeout(() => {
//     store.dispatch({
//         type:'change',
//         payload:8
//     })
// },2000)

// setTimeout(() => {
//     store.dispatch({
//         type:'add'
//     })
// },2000)

// setTimeout(() => {
//     store.dispatch({
//         type:'add'
//     })
// },2000)

// setTimeout(() => {
//     store.dispatch({
//         type:'toggle'
//     })
// },2000)

// setTimeout(() => {
//     store.dispatch({
//         type:'add'
//     })
// },2000)
