function createStore(reducer,preState?,enhancer?){
    if(enhancer){
        return enhancer(createStore)(reducer,preState);
    }
    let state = {};
    let listeners = [];
    const getState = () => {
        return state;
    }
    const dispatch = (action) => {
        console.log(action,state);
        state = reducer(action,state);
        console.log('3434334',state);
        listeners.forEach(listener => listener());
    }
    const subscribe = (func) => {
        listeners.push(func);
        return () => {
            listeners = listeners.filter(listener => listener !== func);
        }
    }
    return {
        getState,
        dispatch,
        subscribe
    }
}

function combineReducers(reducers){
    return (state,action) => {
        return Object.keys(reducers).reduce((nextState,key) => {
            console.log(nextState,key);
            console.log(reducers);
            nextState[key] = reducers[key](state[key],action);
            console.log(nextState);
            return nextState;
        })
    }
}

function thunkMiddleWare(extraArgument?){
    return ({dispatch,getState}) => next => action => {
        if(typeof action === 'function') {
            return action(dispatch,getState,extraArgument);
        } else {
            return next(action);
        }
    }
}
const thunk = thunkMiddleWare();

function applyMiddleware(...middlerwares){
    return createStore => {
        return (reducer,preloadedState?) => {
            const store = createStore(reducer,preloadedState)
            //初始化dispatch
            let dispatch = () => {
                throw new Error(
                    'Dispatching while constructing your middleware is not allowed. ' +
                    'Other middleware would not be applied to this dispatch.'
                )
            }

            const middlewareAPI = {
                getState:store.getState,
                dispatch:(action,...args) => dispatch(action,...args)
            }

            const chain = middlerwares.map(middleware => middleware(middlewareAPI));
            dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            }
        }
    }
}

function compose(...funcs){
    const func = [...funcs];
    let len = func.length;
    if(len === 0) {
        return arg=>arg;
    }
    if(len === 1){
        return func[0];
    }
    return func.reduce((a,b)=>{
        return function(){
            return a(b(...arguments));
        }
    })
}

export {
    createStore,
    applyMiddleware,
    combineReducers
}