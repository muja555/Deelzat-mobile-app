import { createSelector } from 'reselect';

const getChatState = (state) => state.chat;
export const chatStateSelector = createSelector(getChatState, (chatState) => chatState);

export const chatProfileSelector = createSelector(chatStateSelector, (chatState) => chatState.chatProfile);

export const chatImagesSelector = createSelector(chatStateSelector, (chatState) => chatState.imagesToSend);

export const isChatScreenVisibleSelector = createSelector(chatStateSelector, (chatState) => chatState.isChatScreenVisible);

export const unreadMessagesSelector = createSelector(chatStateSelector, (chatState) => chatState.unreadMessages);

export const displaySwipeIndicatorSelector = createSelector(chatStateSelector, (chatState) => chatState.displaySwipeIndicator);

export const supportAccountSelector = createSelector(chatStateSelector, (chatState) => chatState.supportAccount);
