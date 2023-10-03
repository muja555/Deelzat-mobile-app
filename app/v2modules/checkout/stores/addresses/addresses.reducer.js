import { createReducer, on } from "deelzat/store";
import * as Actions  from "./addresses.actions"
import addressesInitialState from "./addresses.state";

const addressesReducer = createReducer(
    addressesInitialState,
    [

        on(Actions.SetUserAddresses, (state,  { payload } ) => {
            return {
                ...state,
                userAddresses: payload
            };
        }),
    ]);

export default addressesReducer;
