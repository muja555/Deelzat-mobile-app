import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatStoreConst = {};
ChatStoreConst.UNREAD_MESSAGES = "ChatStoreConst.UNREAD_MESSAGES";
ChatStoreConst.DID_LEARN_TO_SWIPE = "ChatStoreConst.DID_LEARN_TO_SWIPE";


const updateChatUnreadMessagesForUser = async (userId, toCount = -1) => {

    const unreadMap = await getChatUnreadMessages() || {};
    let userCurrentCount = unreadMap[userId] || 0;

    if (toCount === -1) {
        userCurrentCount = userCurrentCount + 1;
    } else {
        userCurrentCount = toCount;
    }

    unreadMap[userId] = userCurrentCount;
    await saveChatUnreadMessages(unreadMap);

    return unreadMap;
}
export {updateChatUnreadMessagesForUser as updateChatUnreadMessagesForUser}

/**
 * UnreadMap is map between each user id and number of unread messages,,,, ex: { userId: 2}
 * @returns {Promise<unknown>}
 * @param unreadMessages
 */
const saveChatUnreadMessages = async (unreadMessages = {}) => {

    try {
        const value = JSON.stringify(unreadMessages);
        return AsyncStorage.setItem(ChatStoreConst.UNREAD_MESSAGES, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveChatUnreadMessages as saveChatUnreadMessages};

const getChatUnreadMessages = async () => {
    try {
        const value = await AsyncStorage.getItem(ChatStoreConst.UNREAD_MESSAGES);
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getChatUnreadMessages as getChatUnreadMessages};


const saveDidLearnedToSwipe = () => {
    try {
        return AsyncStorage.setItem(ChatStoreConst.DID_LEARN_TO_SWIPE, 'true');
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {saveDidLearnedToSwipe as saveDidLearnedToSwipe};


const checkDidUserLearnedToSwipe = async () => {
    try {
        const value = await AsyncStorage.getItem(ChatStoreConst.DID_LEARN_TO_SWIPE);
        return value
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {checkDidUserLearnedToSwipe as checkDidUserLearnedToSwipe};
