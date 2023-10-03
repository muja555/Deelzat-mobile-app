import { createReducer, on } from "deelzat/store";
import * as Actions  from "./home-shops-stat.actions"
import homeShopsStatInitialState from "./home-shops-stat.state";

const homeShopsStatReducer = createReducer(
    homeShopsStatInitialState,
    [

        on(Actions.addShopStat, (state,  { payload } ) => {

            const {shopId, stat} = payload;
            const cache = state.statCache || {};

            return {
                ...state,
                statCache: {
                    ...cache,
                    [shopId]: stat
                }
            };
        }),

    ]);

export default homeShopsStatReducer;
