import { createAction } from "deelzat/store";


const SET_IS_COMPLETED = '[Shop] Set is Completed';
export const SetIsCompleted = createAction(
    SET_IS_COMPLETED
);

const SET_SHOP_ID = '[Shop] Set Shop Id';
export const SetShopId = createAction(
    SET_SHOP_ID
);

const SET_SHOP_IDS = '[Shop] Set Shop Ids';
export const SetShopIds = createAction(
    SET_SHOP_IDS
);

const SET_SHOP = '[Shop] Set Shop';
export const SetShop = createAction(
    SET_SHOP
);

const ADD_DELETED_PRODUCT_ID = '[Shop] Add Deleted Product ID';
export const AddDeletedProductsId = createAction(
    ADD_DELETED_PRODUCT_ID
);

const SET_THEME = '[Shop] Set Theme';
export const SetTheme = createAction(
    SET_THEME
);

const SET_ADDED_PRODUCT = '[Shop] Set Added Product';
export const SetAddedProduct = createAction(
    SET_ADDED_PRODUCT
);


