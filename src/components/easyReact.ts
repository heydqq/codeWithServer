let workInProgressHook;
let fiber = {
    // 保存该FunctionComponent对应的Hooks链表
    memoizedState:null,
    stateNode:App
}
function App() {
    const [num, updateNum] = useState(0);
    console.log(`${isMount ? 'mount' : 'update'} num: `, num);
    return {
        click() {
          updateNum(num => num + 1);
        }
      }
}

// hook = {
//     queue:{
//         pending:null
//     },
//     // 保存hook对应的state
//     memoizedState:initialState,
//     next:null
// }

function dispatchAction(queue,action){
    const update = {
        action,
        next:null
    }

    if(queue.pending === null){ //还没有update对象
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;
    schedule();
}

let isMount = true;
function schedule(){
    workInProgressHook = fiber.memoizedState;
    const app = fiber.stateNode();
    isMount = false;
    return app;
}
function useState(initialState){
    let hook;
    if(isMount){
        //生成hook对象
        hook = {
            queue:{
                pending:null
            },
            memoizedState:initialState,
            next:null
        };
        if(!fiber.memoizedState){
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else{
        //从 workInProgressHook种取出该useState对应的hook
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }
    let baseState = hook.memoizedState;
    if(hook.queue.pending){
        //更新state
        //获取队列中的第一个update对象
        let firstUpdate = hook.queue.pending.next;
        do{
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while(firstUpdate !== hook.queue.pending)
        hook.queue.pending = null;
    }
    hook.memoizedState = baseState;
    return [baseState,dispatchAction.bind(null,hook.queue)]
}

window.app = schedule();