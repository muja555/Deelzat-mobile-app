import on from "./on";
import createAction from "./create-action";
import createReducer from "./create-reducer";

const StoreCore = {};

StoreCore.on = on;
export { on as on };

StoreCore.createAction = createAction;
export { createAction as createAction };

StoreCore.createReducer = createReducer;
export { createReducer as createReducer };


export default StoreCore;
