import { createStore,
    applyMiddleware,
    combineReducers } from './components/redux';

const test1 = function (state,action){
    switch (action.type){
        case 'change':
            return action.payload;
        case 'add':
            return state + 1;
        case 'minus':
            return state - 1;
        default:
            return 0;
    }
}

const test2 = function(state,action) {
    console.log(state,action)
    switch(action.type){
        case 'toggle':
            return !state;
        default:
            return true;
    }
}

let reducers = combineReducers({
    test1,
    test2
})
let store = createStore(reducers);
store.subscribe(() => {
    console.log('enter---------',store.getState());
})
store.dispatch({
    type:'change',
    payload:3
})