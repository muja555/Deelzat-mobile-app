import { createSelector } from 'reselect';

const getCartState = (state) => state.cart;
export const cartStateSelector = createSelector(getCartState, (cartState) => cartState);

export const cartItemsSelector = createSelector(cartStateSelector, (cartState) => cartState.cartItems);
export const cartSelector = createSelector(cartStateSelector, (cartState) => cartState.cart);
