function createStore(reducers,prevState?,enhancer?){
    if(
        (typeof prevState === 'function' && typeof enhancer === 'undefined') ||
        typeof enhancer === 'function'
    ) {
        return enhancer(createStore)(reducers,prevState);
    }
    let state = {};
    let listeners = [];
    let currentReducers = reducers;
    const getState = () => {
        return state;
    }

    const dispatch = (action) =>{
        state = currentReducers(state,action);
        listeners.forEach(listener => {
            listener()
        })
    }

    const subscribe = (func) => {
        listeners.push(func);
        return () => {
            listeners = listeners.map(listener => listener !== func);
        }
    }

    dispatch({
        type:'@@redux/INIT'
    })

    const replaceReducer = (newReducer) => {
        currentReducers = newReducer;
    }

    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
    }
}

function combineReducers(reducers){
    return (state,action) => {
        return Object.keys(reducers).reduce((nextState,key) => {
            nextState[key] = reducers[key](state[key],action);
            return nextState;
        },{})
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
const middlerware_thunk = thunkMiddleWare();

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
                dispatch:(action,...args) => dispatch(action,...args), //指向了dispath这个变量所指向的地址
                // dispatch1:dispatch  //不行，这样是指向了初始化的dispatch方法所在地址
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
    let resu = func.reduce((a,b)=>{
        return function(){
            return a(b(...arguments));
        }
    })
    return resu;
}

export {
    createStore,
    applyMiddleware,
    combineReducers,
    middlerware_thunk
}