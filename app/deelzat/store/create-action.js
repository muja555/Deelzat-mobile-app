const createAction = (type) => {
    function HaysAction (payload = null) {
        return {
            type: type,
            payload: payload
        };
    }
    return HaysAction

};

export default createAction;
