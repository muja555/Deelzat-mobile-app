import { createSelector } from 'reselect';

const getBoardState = (state) => state.board;
export const boardStateSelector = createSelector(getBoardState, (boardState) => boardState);

export const wishlistItemsSelector = createSelector(getBoardState, (boardState) => boardState.wishlistItems);
export const wishlistSelector = createSelector(getBoardState, (boardState) => boardState.wishlist);
