import { createReducer, on } from "deelzat/store";
import * as Actions  from "./chat.actions"
import chatState from "./chat.state";

const chatReducer = createReducer(
    chatState,
    [
        on(Actions.SetChatProfile, (state,  { payload } ) => {
            return {
                ...state,
                chatProfile: payload
            };
        }),
        on(Actions.SetChatImages, (state,  { payload } ) => {
            return {
                ...state,
                imagesToSend: payload
            };
        }),
        on(Actions.SetIsChatRoomVisible, (state,  { payload } ) => {
            return {
                ...state,
                isChatScreenVisible: payload
            };
        }),
        on(Actions.CleanChatImages, (state,  { payload } ) => {

            state.imagesToSend.forEach(img => {
                img.uploadTask?.cancel();
            })

            return {
                ...state,
                imagesToSend: []
            };
        }),
        on(Actions.SetUnreadMessages, (state,  { payload } ) => {
            return {
                ...state,
                unreadMessages: payload
            };
        }),
        on(Actions.SetDisplaySwipeIndicator, (state,  { payload } ) => {
            return {
                ...state,
                displaySwipeIndicator: payload
            };
        }),
        on(Actions.SetSupportAccount, (state,  { payload } ) => {
            return {
                ...state,
                supportAccount: payload
            };
        }),
    ]);

export default chatReducer;
