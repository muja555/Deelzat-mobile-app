import { createSelector } from 'reselect';

const getShopState = (state) => state.shop;
export const shopStateSelector = createSelector(getShopState, (subState) => subState);
export const themeSelector = createSelector(getShopState, (shopState) => shopState.theme);

// Workaround results of shop data not being reflected
export const addedTempProductSelector = createSelector(getShopState, (shopState) => shopState.addedProduct);
export const deletedProductsSelector = createSelector(getShopState, (subState) => subState.deletedProductsIds);
