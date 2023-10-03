import { createAction } from "deelzat/store";

const SET_DATA = '[Checkout] Set Data';
export const SetData = createAction(
    SET_DATA
);

const SET_SESSION_DATA = '[Checkout] Set Session Data';
export const SetSessionData = createAction(
    SET_SESSION_DATA
);

const SET_SAVED_ADDRESS = '[Checkout] Set Saved Address';
export const SetSavedAddress = createAction(
    SET_SAVED_ADDRESS
);

const SET_ADDONS_LIST = '[Checkout] Set Addons List';
export const SetAddonsList = createAction(
    SET_ADDONS_LIST
);

const SET_COUPON = '[Checkout] Set Coupon';
export const SetCoupon = createAction(
    SET_COUPON
);

const RESET_DATA = '[Product] Reset Data';
export const ResetData = createAction(
    RESET_DATA
);

