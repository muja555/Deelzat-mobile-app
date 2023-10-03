import { createSelector } from 'reselect';

const getAddressesState = (state) => state.addresses;
export const addressesStateSelector = createSelector(getAddressesState, (subState) => subState);
export const userAddressesSelector = createSelector(addressesStateSelector, (addressesState) => addressesState.userAddresses);
