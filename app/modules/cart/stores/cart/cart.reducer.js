import { createReducer, on } from "deelzat/store";
import * as Actions  from "./cart.actions"
import cartState from "./cart.state";

const cartReducer = createReducer(
    cartState,
    [
        on(Actions.SetCartItems, (state,  { payload } ) => {
            return {
                ...state,
                cartItems: payload
            };
        }),
        on(Actions.SetCart, (state,  { payload } ) => {
            return {
                ...state,
                cart: payload
            };
        }),
    ]);

export default cartReducer;
