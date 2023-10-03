import { createReducer, on } from "deelzat/store";
import * as Actions  from "./blocked-shops.actions"
import blockedShopsInitialState from "./blocked-shops.state";
import { saveBlockedShops } from 'v2modules/shop/others/blocked-shop.localstore';

const blockedShopsReducer = createReducer(
    blockedShopsInitialState,
    [

        on(Actions.SetBlockedShopIdsList, (state,  { payload } ) => {
            return {
                ...state,
                listIds: payload
            };
        }),
        on(Actions.AddBlockedShopId, (state,  { payload } ) => {

            const newList = [...state.listIds, payload];
            saveBlockedShops(newList);

            return {
                ...state,
                listIds: newList
            };
        }),

        on(Actions.RemoveBlockedShopId, (state,  { payload } ) => {

            const newList = state.listIds.filter(id =>  payload === id);
            saveBlockedShops(newList);

            return {
                ...state,
                listIds: newList
            };
        }),
    ]);

export default blockedShopsReducer;
