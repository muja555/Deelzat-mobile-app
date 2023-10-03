import { createSelector } from 'reselect';

const getCheckoutState = (state) => state.checkout;
export const checkoutStateSelector = createSelector(getCheckoutState, (subState) => subState);
export const selectedSavedAddressSelector = createSelector(checkoutStateSelector, (subState) => subState.selectedSavedAddress);
export const sessionDataSelector = createSelector(checkoutStateSelector, (subState) => subState.session);
export const couponSelector = createSelector(checkoutStateSelector, (subState) => subState.coupon);
export const buyerInfoSelector = createSelector(checkoutStateSelector, (subState) => subState.buyerInfo);
export const addonsListSelector = createSelector(checkoutStateSelector, (subState) => subState.addonsList);
export const checkoutItemsSelector = createSelector(checkoutStateSelector, (subState) => subState.checkoutItems);
export const trackSourceSelector = createSelector(checkoutStateSelector, (subState) => subState.trackSource);
