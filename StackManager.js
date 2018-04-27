import {
    Platform,
    AppState,
    BackHandler,
    NativeAppEventEmitter
} from 'react-native';

import EventEmitter from 'EventEmitter';

const TYPE_NATIVE = 0;
const TYPE_REACT_ROOT = 1;
const TYPE_REACT = 2;

let lastPopNativeTime = 0;

const isAndroid = Platform.OS === 'android';
const StackEventEmitter = new EventEmitter();

let pageStack = [];

if (isAndroid) {
    BackHandler.addEventListener('hardwareBackPress', handleBackEvent);
} else {
    AppState.addEventListener('change', (state) => {
        //
    });
}

NativeAppEventEmitter.addListener('_push_', (pageInfo) => {
    push(pageInfo.type, pageInfo.id);
});

NativeAppEventEmitter.addListener('_pop_', (pageInfo) => {
    popNative(pageInfo && pageInfo.id);
});

NativeAppEventEmitter.addListener('_popTo_', (pageInfo) => {
    popToNative(pageInfo && pageInfo.id);
});

NativeAppEventEmitter.addListener('_popToRoot_', handlePopToRoot);

function handleBackEvent() {
    for (let i = pageStack.length - 1; i >= 0; i--) {
        let pageInfo = pageStack[i];
        if (pageInfo.type === TYPE_REACT_ROOT) {
            StackEventEmitter.emit('onBackPressed', pageInfo.id);
            break;
        }
        if (i === 0 && pageInfo.type === TYPE_REACT) {
            StackEventEmitter.emit('onBackPressed', pageInfo.id);
            break;
        }
    }
    return true;
}

function push(type, id) {
    if (type === TYPE_NATIVE) {
        pageStack.push({type, id});
    } else if (type === TYPE_REACT_ROOT) {
        let length = pageStack.length;
        if (length === 0) {
            pageStack.push({type, id});
        } else {
            let last = pageStack[length - 1];
            if (last.type !== TYPE_REACT_ROOT) {
                pageStack.push({type, id});
            }
        }
    } else {
        let i;
        for (i = pageStack.length - 1; i >= 0; i--) {
            let pageInfo = pageStack[i];
            if (!pageInfo) {
                continue;
            }
            if (pageInfo.type !== TYPE_NATIVE) {
                break;
            }
        }
        pageStack.splice(i + 1, 0, {type, id});
    }
}

function pop() {
    pageStack.pop();
}

function popTo(id) {
    for (let i = pageStack.length - 1; i >= 0; i--) {
        let pageInfo = pageStack[i];
        if (id === pageInfo.id) {
            pageStack.splice(i + 1);
            break;
        }
    }
}

function popNative(id) {
    if(!isAndroid){
        let current = new Date().getTime();
        if(current - lastPopNativeTime < 100){
            return;
        }
        lastPopNativeTime = current;
    }
    let condition = !!id ?
            info => id === info.flag : info => TYPE_REACT !== info.type ;
    for (let i = pageStack.length - 1; i >= 0; i--) {
        if (condition(pageStack[i])) {
            pageStack.splice(i);
            break;
        }
    }
}

function popToNative(id) {
    if (!id) return;
    let length = pageStack.length;
    for (let i = length - 1; i >= 0; i--) {
        let pageInfo = pageStack[i];
        if (id === pageInfo.id) {
            if (id.type !== TYPE_REACT_ROOT) {
                pageStack.splice(i + 1);
            } else {
                i++;
                while (i < length && pageStack[i].type === TYPE_REACT) {
                    i++;
                }
                pageStack.splice(i);
            }
            break;
        }
    }
}

// native调用了popToRoot，通知rn作页面回跳和信息清理
function handlePopToRoot() {
    let length = pageStack.length;
    if (length === 0) {
        return;
    }
    let bottom = pageStack[0];//取栈底页面判断首页类型
    let begin = 0;
    let popNum = 0;
    let id;
    if (TYPE_NATIVE === bottom.type) {
        return;
    } else if (TYPE_REACT_ROOT === bottom.type) {
        begin = 1;
    } else {
        begin = 0;
    }
    for (let i = begin; i < length; i++) {
        let pageInfo = pageStack[i];
        if (pageInfo.type !== TYPE_REACT) {
            break;
        } else {
            if (id) {
                popNum++;
            } else {
                id = pageInfo.id; //找到navigator对应的flag
            }
        }
    }
    StackEventEmitter.emit('popEvent', {popNum, id, toId: id}); //通知Navigator回退rn页面
    pageStack.splice(begin + 1);
    printStack();
}

function printStack() {
    console.log('-------------------------------');
    console.log(JSON.stringify(pageStack));
    console.log('-------------------------------');
}

module.exports = {
    pop,
    push,
    popTo,
    printStack,
    TYPE_REACT,
    TYPE_NATIVE,
    TYPE_REACT_ROOT
};
