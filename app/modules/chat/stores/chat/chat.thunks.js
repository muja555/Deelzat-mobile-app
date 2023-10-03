import * as Actions from "./chat.actions";
import storage from "@react-native-firebase/storage";
import uniqueId from 'lodash/uniqueId';
import {
    getChatProfileFromFirestore,
    updateChatProfileOnFirestore
} from "modules/chat/others/chat.utils";
import {
    checkDidUserLearnedToSwipe,
    getChatUnreadMessages, saveChatUnreadMessages,
    saveDidLearnedToSwipe, updateChatUnreadMessagesForUser
} from "modules/chat/others/chat.localstore";
import {chatActions} from "./chat.store";
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";


export const setupSupportAccount = (remoteConfig) => {
    return async (dispatch, getState) => {

        const supportAccount = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.SupportChatAccount)?.asString());

        if (supportAccount) {

            const remoteAccountInfo = await getChatProfileFromFirestore(supportAccount.userId)

            dispatch(Actions.SetSupportAccount({...remoteAccountInfo, ...supportAccount}))

            // Update my profile if I am the support account
            const thisUserId = getState()?.auth?.auth0User?.userId;
            if (!!thisUserId && thisUserId === supportAccount.userId) {
                updateChatProfileOnFirestore({userId: thisUserId, isSupportAccount: true}, true)
            }
        }
    }
}


export const initializeShouldDisplaySwipeIndicator = () => {
    return async (dispatch, getState) => {

        const hasBeenShowed = await checkDidUserLearnedToSwipe();
        dispatch(chatActions.SetDisplaySwipeIndicator(!hasBeenShowed))

    }
}


export const setShouldNotDisplaySwipeIndicator = () => {
    return async (dispatch, getState) => {

        saveDidLearnedToSwipe();
        dispatch(chatActions.SetDisplaySwipeIndicator(false))

    }
}

export const uploadImagesForSend = (roomName, imagesToSend) => {
    return async (dispatch, getState) => {

        const userId = getState().chat.chatProfile.userId;

        const getImageWithId = (id) => {
            return getState().chat.imagesToSend.find(img => img.id === id);
        }

        const dispatchImage = (image) => {
            const images = getState().chat.imagesToSend;
            const stateImages = getState().chat.imagesToSend;
            const imgIndex = stateImages.findIndex(_image => _image.id === image.id)
            if (imgIndex !== -1) {
                images[imgIndex] = image;
            } else {
                images.push(image)
            }

            dispatch(Actions.SetChatImages([...images]));
        }

        const isCroppedImage = (_image) => {
            const currentImage = getImageWithId(_image.id)
            return !!currentImage && currentImage.uri !== _image.uri
        }

        imagesToSend.forEach(_image => {

            if ((!!_image.downloadURL
                || _image.status === 'uploading'
                || _image.status === 'success') && !isCroppedImage(_image)) {

                dispatchImage(_image);
                return;
            }

            const fileName = `${userId}_${Math.random().toString(36).substring(7)}.jpg`;
            const folderName = new Date().toLocaleDateString('en-US').replace(/\//g, '-').replace(',', '-');
            const filePath = `chat_media/${roomName}/${folderName}/${fileName}`;
            const uploadTask = storage()
                .ref(filePath)
                .putFile(_image.path || _image.uri);

            const newImage = {
                id: _image.id,
                uri: _image.uri,
                status: 'uploading',
                progress: 0,
                filePath,
                uploadTask,
            };

            if (!newImage.id) {
                newImage.id = uniqueId(['']);
            }

            dispatchImage(newImage);

            uploadTask.on(storage.TaskEvent.STATE_CHANGED,
                snapshot => {

                    const currentImage = getImageWithId(newImage.id);
                    if (currentImage) {
                        currentImage.progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                        if (snapshot.state === storage.TaskState.SUCCESS) {
                            currentImage.status = 'success'
                        }
                        dispatchImage(currentImage);
                    }

                }, (error) => {

                    console.warn(error);
                    const currentImage = getImageWithId(newImage.id);
                    if (currentImage && error.code !== 'storage/canceled') {
                        currentImage.status = 'error';
                        dispatchImage(currentImage);
                    }

                }, () => {

                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        const currentImage = getImageWithId(newImage.id);
                        if (currentImage) {
                            currentImage.downloadURL = downloadURL;
                            dispatchImage(currentImage)
                        }
                    });
                });
        });

    }
}


export const removeImageToSend = (image) => {
    return async (dispatch, getState) => {

        const currentImage = getState().chat.imagesToSend.find(img => img.id === image.id) || image;
        currentImage.uploadTask?.cancel();

        if (image.filePath)
            storage()
                .ref(image.filePath)
                .delete()
                .catch(console.warn);

        await dispatch(Actions.SetChatImages(getState().chat.imagesToSend.filter(img => img.id !== image.id)))
    }
}


export const loadUnreadMessages = () => {
    return async (dispatch, getState) => {

        const unreadMap = await getChatUnreadMessages() || {};

        const _map = {};
        Object.keys(unreadMap).forEach((key) => {
            if (key && key !== 'undefined' && unreadMap[key] > 0) {
                _map[key] = unreadMap[key];
            }
        });

        saveChatUnreadMessages(_map);

        dispatch(chatActions.SetUnreadMessages(_map));
    }
}


/**
 * @param userId
 * @param toCount if -1? increment the current value ELSE set the paassed value as unread count
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const addUnreadMessageForUser = (userId, toCount = -1) => {
    return async (dispatch, getState) => {

        if (!userId)
            return;

       await updateChatUnreadMessagesForUser(userId, toCount);
       dispatch(loadUnreadMessages());
    }
}






