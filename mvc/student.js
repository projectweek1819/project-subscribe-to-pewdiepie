// Schrijf hier je code
function onMouseDown(state, args) {
    return state + 1;
}

function onMouseDown2(state, args) {
    return { count: state.count + 1};
}

function counter3(){
    function onMouseDown(state, args) {
        return { count: state.count + 1};
    }

    return { controller: { onMouseDown } };

}

function counter4(){
    function onMouseDown(state, args) {
        return {count: state.count + 1};
    }

    function onKeyDown(state, args) {
        return {count: 0};
    }

    return { controller: {onMouseDown, onKeyDown} };
}

function counter5(){
    function onMouseDown(state, args) {
        if (args.shift){
            if (state.count >= 1){
                return { count: state.count - 1};
            }
        } else {
            return { count: state.count + 1};
        }
        return { count: state.count};
    }

    function onKeyDown(state, args) {
        if (args.key === "ArrowUp"){
            return { count: state.count + 1};
        }
        if(args.key === "ArrowDown"){
            if (state.count >= 1){
                return { count: state.count - 1};
            }
        }
        if (args.key === "0"){
            return { count: 0};
        }
        return { count: state.count};
    }

    return { controller: {onMouseDown, onKeyDown} };
}

function counter6() {
    function increment(state) {
        return { count: state.count + 1};
    }

    function decrement(state) {
        if (state.count >= 1){
            return { count: state.count - 1};
        }
        return { count: state.count}
    }

    function reset(state) {
        return { count: 0};
    }

    function onMouseDown(state, args) {
        if (args.shift === true){
            return decrement(state);
        }else{
            return increment(state);
        }
    }

    function onKeyDown(state, args) {
        if (args.key === "ArrowUp"){
            return increment(state);
        }
        if(args.key === "ArrowDown"){
            return decrement(state);
        }
        if (args.key === "0"){
            return reset(state);
        }
        if (args.key === " "){
            return increment(state);
        }
        return { count: state.count};
    }

    const controller = { onMouseDown, onKeyDown };
    const model = { increment, decrement, reset };
    return { controller, model };
}

function counter7(){

    function add(state, foo){
        if (state.count + foo >= 0){
            return {count: state.count + foo};
        }
        return {count: 0};
    }

    function onKeyDown(state, args){
        return {count: state.count};
    }

    function reset(state) {
        return { count: 0};
    }

    function onMouseDown(state, args) {
        if (args.shift === true){
            if (args.ctrl){
                return add(state, -5);
            }else{
                return add(state, -1);
            }
        }else{
            if (args.ctrl){
                return add(state, 5);
            }else{
                return add(state, 1);
            }
        }
    }

    function onKeyDown(state, args){
        if (args.key === "ArrowUp" || args.key === " "){
            if (args.ctrl){
                return add(state, 5);
            }else{
                return add(state, 1);
            }
        }
        if(args.key === "ArrowDown"){
            if (args.ctrl){
                return add(state, -5);
            }else{
                return add(state, -1);
            }
        }
        if (args.key === "0"){
            return reset(state);
        }
        return { count: state.count};
    }

    const controller = { onMouseDown, onKeyDown };
    const model = { add, reset };
    return { controller, model };
}
