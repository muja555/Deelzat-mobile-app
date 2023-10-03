
function ChatStoreState() {
    return {
        chatProfile: {},
        imagesToSend: [],
        isChatScreenVisible: false,
        unreadMessages: {},
        displaySwipeIndicator: false,
        supportAccount: undefined,
    }
}

const chatState = new ChatStoreState();
export default chatState;
