import { createStore,
    applyMiddleware,
    combineReducers,
    middlerware_thunk } from '../components/redux';

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


let baseReducer = {
    test1,
    test2
}
let reducers = combineReducers(baseReducer)

let logger1 = (middlerWareAPI:any) => {
    return (next) => {
        // console.log('next1.next:',next);
        return action => {
            // console.log('next1.action:',action)
            // console.log('logger1 start');
            let result = next(action);
            // console.log('logger2 end')
            return result;
        }
    }
}

let logger2 = (middlerWareAPI:any) => {
    return (next) => {
        // console.log('next2.next:',next);
        return action => {
            // console.log('next2.action:',action)
            // console.log('logger2 start');
            let result = next(action);
            // console.log('logger2 end')
            return result;
        }
    }
}

let enhancer = applyMiddleware(logger1,logger2,middlerware_thunk);
let store = createStore(createReducer(),null,enhancer);
/**----------------抽不出去 ------------------ */
store.asyncReducers = {};
function createReducer (asyncReducers?){
    return combineReducers({
        ...baseReducer,
        ...asyncReducers
    })
}

function injectedReducer (store,name,reducer){
    store.asyncReducers[name] = reducer;
    store.replaceReducer(createReducer(store.asyncReducers))
}
/**----------------抽不出去 ------------------ */

console.log('init------',store.getState())
store.subscribe(() => {
    console.log('update------',store.getState())
})
setTimeout(() => {
    store.dispatch({
        type:'toggle'
    })
},2000)
function setRandomTest () {
    let arg = [...arguments];
    return function(dispatch,getState){
        setTimeout(() => {
            dispatch({
                type:'change',
                payload: Math.floor(Math.random() * 96 + 2)
            })
        },1000)

        setTimeout(() => {
            dispatch({
                type:'change',
                payload: Math.floor(Math.random() * 96 + 2)
            })
        },1000)
    }
}

setTimeout(() => {
    store.dispatch(setRandomTest('a','b','c'))
},2000)

let injReducer = (state = 0,action) => {
    switch (action.type){
        case 'changeTest3':
            return action.payload;
        default:
            return state;
    }
}

setTimeout(() => {
    injectedReducer(store,'test3',injReducer);
},2000)

setTimeout(() => {
    store.dispatch({
        type:'changeTest3',
        payload:'232323'
    })
},2000)

setTimeout(() => {
    store.dispatch({
        type:'toggle'
    })
},2000)

setTimeout(() => {
    store.dispatch({
        type:'changeTest3',
        payload:'wsfsfsdf'
    })
},2000)

setTimeout(() => {
    store.dispatch({
        type:'toggle'
    })
    console.log(store)
},2000)
