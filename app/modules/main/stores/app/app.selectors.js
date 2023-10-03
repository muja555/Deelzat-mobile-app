import {createSelector} from 'reselect';

const getAppState = (state) => state.app;
export const appStateSelector = createSelector(getAppState, (subState) => subState);

const getDataState = (subState) => subState.data;
export const dataSelector = createSelector(getAppState, getDataState);
export const swipeEnabledSelector = createSelector(getAppState, (subState) => subState.swipeEnabled);
export const isRemoteConfigsReadySelector = createSelector(getAppState, (subState) => subState.isRemoteConfigsReady);
export const appInitializedSelector = createSelector(getAppState, (subState) => subState.appInitialized);
export const isStagingAPISelector = createSelector(getAppState, (subState) => subState.isStagingApi);
export const inAppPopupSelector = createSelector(getAppState, (subState) => subState.inAppPopup);
