import { createSelector } from 'reselect';

const getBlockedShopsState = (state) => state.blockedShops;
export const blockedShopsStateSelector = createSelector(getBlockedShopsState, (subState) => subState);
export const blockedShopIdsSelector = createSelector(blockedShopsStateSelector, (state) => state.listIds);
