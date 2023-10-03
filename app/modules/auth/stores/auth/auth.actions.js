import {createAction} from "deelzat/store";


const SET_AUTH_0 = '[Auth] Set Auth0';
export const SetAuth0 = createAction(
    SET_AUTH_0
);

const SET_IS_AUTHENTICATED = '[Auth] Set Is Authenticated';
export const SetIsAuthenticated = createAction(
    SET_IS_AUTHENTICATED
);

const SET_CHECKED = '[Auth] Set Checked';
export const SetChecked = createAction(
    SET_CHECKED
);

const SET_AUTH_0_USER = '[Auth] Set Auth0 User';
export const SetAuth0User = createAction(
    SET_AUTH_0_USER
);

