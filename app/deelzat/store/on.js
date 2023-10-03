const on = (action, callback) => {
    return {
        type: action().type,
        callback: callback
    }
};

export default on;
