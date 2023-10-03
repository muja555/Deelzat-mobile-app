import { createAction } from "deelzat/store";

const SET_BLOCKED_SHOP_IDS_LIST = '[BlockedShops] Set Blocked Shop Ids List';
export const SetBlockedShopIdsList = createAction(
    SET_BLOCKED_SHOP_IDS_LIST
);


const ADD_BLOCKED_SHOP_ID = '[BlockedShops] Add Blocked Shop Id';
export const AddBlockedShopId = createAction(
    ADD_BLOCKED_SHOP_ID
);

const REMOVE_BLOCKED_SHOP_ID = '[BlockedShops] Remove Blocked Shop Id';
export const RemoveBlockedShopId = createAction(
    REMOVE_BLOCKED_SHOP_ID
);
