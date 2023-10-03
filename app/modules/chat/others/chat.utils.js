import TimeAgo from "javascript-time-ago";
import firestore from "@react-native-firebase/firestore";
import ConversationActionsConst from "modules/chat/constants/conversation-actions.const";
import StarIcon from 'assets/icons/Star.svg'
import DeleteIcon from 'assets/icons/NewDelete.svg'
import {Colors} from "deelzat/style";
import {UserChatRoomData} from "deelzat/types/user-chat-room-info";
import I19n, {getLocale} from 'dz-I19n';

let timeAgoInitialized = false;

export const ConversationActionsConfig = []
ConversationActionsConfig[ConversationActionsConst.DELETE] = {
    icon: DeleteIcon,
    text: I19n.t('تم حذف المحادثة'),
    backgroundColor: Colors.ERROR_COLOR,
}
ConversationActionsConfig[ConversationActionsConst.ADD_STAR] = {
    icon: StarIcon,
    text: I19n.t('تم إضافة المحادثة للرسائل المفضلة'),
    backgroundColor: Colors.YELLOW,
}
ConversationActionsConfig[ConversationActionsConst.REMOVE_STAR] = {
    icon: StarIcon,
    text: I19n.t('تم حذف المحادثة من الرسائل المفضلة'),
    backgroundColor: Colors.YELLOW,
}


const getRoomName = (user1, user2) => {
   return user1 > user2?
       user2 + "-" + user1
        : user1 + "-" + user2;

}
export {getRoomName as getRoomName}


let timeFormatter;
const getTimeSince = (dateMillis) => {

    if (!dateMillis)
        return '';

    if (!timeAgoInitialized) {
        if (getLocale() === 'ar') {
            TimeAgo.addLocale(require("javascript-time-ago/locale/ar"));
        } else {
            TimeAgo.addLocale(require("javascript-time-ago/locale/en"));
        }
        timeAgoInitialized = true;
    }

   if (!timeFormatter) {
      timeFormatter = new TimeAgo(getLocale())
   }

   return timeFormatter.format(dateMillis)
}
export {getTimeSince as getTimeSince}


export const generateChatProfile = (shop, auth0User) => {
    if (shop) {
        const auth0UserId = shop.users_ids?.length? shop.users_ids[0] : auth0User.userId;
        const shopFirstLastName = `${shop?.user?.firstName ?? ''} ${shop?.user?.lastName ?? ''}`.trim();
        return  {
            name: shop.name?.trim() || shopFirstLastName || '',
            email: shop.user?.email,
            avatar: shop.user?.picture || shop.picture,
            userId: auth0UserId,
            shopId: shop.id,
        }
    }
   else if (auth0User) {
        return {
            name: `${auth0User.firstName ?? ''} ${auth0User.firstName ?? ''}`.trim() || auth0User.nickname || auth0User.name,
            avatar: auth0User.picture,
            email: auth0User.email,
            userId: auth0User.userId || auth0User.id,
            shopId: null
        }
    }
}


export const updateChatProfileOnFirestore = (chatProfile, withMerge = false) => firestore()
    .collection('users')
    .doc(chatProfile.userId)
    .set(chatProfile, {merge: withMerge})
    .catch(console.warn)


const getChatProfileFromFirestore = (userId) =>  firestore().collection('users')
    .doc(userId)
    .get()
    .then(doc => doc.data())
    .catch(console.warn)
export {getChatProfileFromFirestore as getChatProfileFromFirestore}


/**
 * Delete just the room reference in this user profile
 * @param chatRoomId chat room to be deleted
 * @param userId this user id
 * @returns {Promise<void>}
 */
const deleteChatRoomForUser = (forUserId, roomName) => firestore().collection(`users/${forUserId}/chat_rooms`)
    .doc(roomName)
    .delete()
    .catch(console.warn)
export {deleteChatRoomForUser as deleteChatRoomForUser}


const updateRoomDataForUser = (forUserId, roomName, messageData :UserChatRoomData) => {

    return firestore().collection(`users/${forUserId}/chat_rooms`)
        .doc(roomName)
        .set(messageData, {merge: true}).catch(console.warn)
}
export {updateRoomDataForUser as updateRoomDataForUser}


const deleteAllMessagesInRoom = (roomName) => {

    return firestore().collection('chat_rooms')
        .doc(roomName)
        .collection('messages')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
}
export {deleteAllMessagesInRoom as deleteAllMessagesInRoom}


const deleteAllChatRoomMedia = (roomName) => {
    // storage().ref(`chat_media/${roomName}`)
    //     .listAll()
    //     .then((listRes) => {
    //         console.log("==== res.items ", listRes.items?.length)
    //     })
}
export {deleteAllChatRoomMedia as deleteAllChatRoomMedia}





