import { createReducer, on } from "deelzat/store";
import * as Actions  from "./board.actions"
import boardInitialState from "./board.state";

const boardReducer = createReducer(
    boardInitialState,
    [
        on(Actions.SetWishlistItems, (state,  { payload } ) => {
            return {
                ...state,
                wishlistItems: payload
            };
        }),
        on(Actions.SetWishlist, (state,  { payload } ) => {
            return {
                ...state,
                wishlist: payload
            };
        }),
    ]);

export default boardReducer;
