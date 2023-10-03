import { createAction } from "deelzat/store";

const SET_CART_ITEMS = '[Cart] Set Cart Items';
export const SetCartItems = createAction(
    SET_CART_ITEMS
);

const SET_CART = '[Cart] Set Cart';
export const SetCart = createAction(
    SET_CART
);

