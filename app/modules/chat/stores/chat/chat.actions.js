import { createAction } from "deelzat/store";

const SET_CHAT_PROFILE = '[Chat] Set Chat Profile';
export const SetChatProfile = createAction(
    SET_CHAT_PROFILE
);

const SET_CHAT_IMAGES = '[Chat] Set Chat Images';
export const SetChatImages = createAction(
    SET_CHAT_IMAGES
);

const CLEAN_CHAT_IMAGES = '[Chat] Clean Chat Images';
export const CleanChatImages = createAction(
    CLEAN_CHAT_IMAGES
);

const SET_IS_CHAT_ROOM_VISIBLE = '[Chat] Set Is Chat Room Visible';
export const SetIsChatRoomVisible = createAction(
    SET_IS_CHAT_ROOM_VISIBLE
);


const SET_UNREAD_MESSAGES = '[Chat] Set Unread Messages';
export const SetUnreadMessages = createAction(
    SET_UNREAD_MESSAGES
);


const SET_DISPLAY_SWIPE_INDICATOR = '[Chat] Set Display Swipe Indicator';
export const SetDisplaySwipeIndicator = createAction(
    SET_DISPLAY_SWIPE_INDICATOR
);

const SET_SUPPORT_ACCOUNT = '[Chat] Set Support Account';
export const SetSupportAccount = createAction(
    SET_SUPPORT_ACCOUNT
);
