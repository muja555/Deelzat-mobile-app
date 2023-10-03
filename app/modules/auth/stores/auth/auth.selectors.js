import {createSelector} from 'reselect';

const getAuthState = (state) => state.auth;
export const authStateSelector = createSelector(getAuthState, (subState) => subState);

export const isAuthenticatedSelector = createSelector(getAuthState, (subState) => subState.isAuthenticated);

export const checkedSelector = createSelector(getAuthState, (subState) => subState.checked);

export const auth0UserSelector = createSelector(getAuthState, (subState) => subState.auth0User);
