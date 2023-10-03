const createReducer = (initialState, ons = []) => {

    let actions = new Map();

    ons.forEach( (on) => {
        actions.set(on.type, on.callback)
    });

    return function reducer(state = initialState, action) {
        if(!actions.has(action.type) ) {
            return state;
        }
        return actions.get(action.type)(state, action);
    }

};

export default createReducer;
