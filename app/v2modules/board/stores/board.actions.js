import { createAction } from "deelzat/store";

const SET_WISHLIST_ITEMS = '[Wishlist] Set Wishlist Items';
export const SetWishlistItems = createAction(
    SET_WISHLIST_ITEMS
);

const SET_WISHLIST = '[Wishlist] Set Wishlist';
export const SetWishlist = createAction(
    SET_WISHLIST
);
