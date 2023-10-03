import {createReducer, on} from "deelzat/store";
import * as Actions from "./auth.actions"
import authInitialState from "./auth.state";

const authReducer = createReducer(
    authInitialState,
    [

        on(Actions.SetIsAuthenticated, (state,  { payload } ) => {
            return {
                ...state,
                isAuthenticated: payload
            };
        }),

        on(Actions.SetAuth0, (state,  { payload } ) => {
            return {
                ...state,
                auth0: payload
            };
        }),

        on(Actions.SetAuth0User, (state,  { payload } ) => {
            return {
                ...state,
                auth0User: payload
            };
        }),


        on(Actions.SetChecked, (state,  { payload } ) => {
            return {
                ...state,
                checked: payload
            };
        }),

    ]);

export default authReducer;
