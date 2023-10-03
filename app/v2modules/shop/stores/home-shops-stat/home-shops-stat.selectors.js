import { createSelector } from 'reselect';

const getHomeShopStatsState = (state) => state.homeShopsStat;
export const homeShopsStatsSelector = createSelector(getHomeShopStatsState, (subState) => subState);
export const homeShopStatsSelector = (shopId) => (state) => (state.homeShopsStat.statCache || {})[shopId];

