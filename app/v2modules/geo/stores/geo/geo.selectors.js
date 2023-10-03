import { createSelector } from 'reselect';

const getGeoState = (state) => state.geo;
export const geoStateSelector = createSelector(getGeoState, (subState) => subState);
export const geoCountryCodeSelector = createSelector(geoStateSelector, (state) => state.geoCountryCode);
export const geoBrowseCountryCodeSelector = createSelector(geoStateSelector, (state) => state.browseCountryCode);
export const allowToShowSwitchMarketSelector = createSelector(geoStateSelector, (state) => state.allowToShowSwitchMarket);
export const currencyCodeSelector = createSelector(geoStateSelector, (state) => state.currencyCode);
