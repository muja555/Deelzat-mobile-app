import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {View, Animated, TouchableOpacity} from 'react-native'
import {conversationsListStyle as style} from './conversations-list-item.component.style'
import {
    ConversationActionsConfig, deleteAllMessagesInRoom, deleteChatRoomForUser,
    getRoomName,
    getTimeSince,
    updateRoomDataForUser,
} from 'modules/chat/others/chat.utils';
import ConversationActions from "modules/chat/constants/conversation-actions.const";
import I19n from "dz-I19n";
import {DzText} from "deelzat/v2-ui";
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import ConversationsListService from 'modules/chat/components/conversations-list/conversations-list.component.service';
import { chatSelectors, chatThunks } from 'modules/chat/stores/chat/chat.store';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import ConversationActionsConst from 'modules/chat/constants/conversation-actions.const';

const ConversationsListItem = React.forwardRef((props, ref) => {
    const {
        item = {},
        onPress = (item) => {},
        chatProfile = {},
    } = props;


    const dispatch = useDispatch();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const indicatorAnim = useRef(new Animated.Value(5)).current;

    const unreadMessages = useSelector(chatSelectors.unreadMessagesSelector);
    const unreadCount = useMemo(() => {
        return unreadMessages[item.lastMessageSender] || 0;
    }, [unreadMessages]);

    const displaySwipeIndicator = useSelector(chatSelectors.displaySwipeIndicatorSelector)
    const [displayedActionFeedback, displayedActionFeedbackSet] = useState();
    const config = useMemo(() => ConversationActionsConfig[displayedActionFeedback], [displayedActionFeedback]);

    useImperativeHandle(ref, () => ({
        displayActionFeedback: (action: ConversationActions) =>
            displayedActionFeedbackSet(action)
    }))


    const onFinishFeedback = (item, action) => {
        if (action === ConversationActionsConst.DELETE) {
            onDeletePressed(item);
        }
        else {
            onStarredPressed(item);
        }
    }

    const onStarredPressed = (chatItem) => {

        const roomName = getRoomName(chatItem.otherUser.userId, chatProfile.userId)
        updateRoomDataForUser(chatProfile.userId, roomName, {
            ...chatItem,
            isStarred: !chatItem.isStarred
        })
            .then(() => {
                ConversationsListService.invokeRefreshList();
                displayedActionFeedbackSet();
            })
    }

    const onDeletePressed = (chatItem) => {

        dispatch(chatThunks.addUnreadMessageForUser(chatItem.otherUser.userId, 0));

        const roomName = getRoomName(chatItem.otherUser.userId, chatProfile.userId)
        deleteChatRoomForUser(chatProfile.userId, roomName);

        // If the same conversation has been removed from other user already;
        // Then: Remove all messages
        firestore()
            .collection(`users/${chatItem.otherUser.userId}/chat_rooms`)
            .doc(roomName)
            .get()
            .then(doc => {
                const roomData = doc.data();
                if (!roomData) {
                    deleteAllMessagesInRoom(roomName);
                }

                ConversationsListService.invokeRefreshList();
                displayedActionFeedbackSet();
            });
    }



    const startIndicatorAnimation = () => {
        if (displaySwipeIndicator) {
            Animated.sequence([
                Animated.timing(indicatorAnim, {
                    toValue: 10,
                    duration: 400,
                    delay: 500,
                    useNativeDriver: false
                }),
                Animated.timing(indicatorAnim, {
                    toValue: 5,
                    duration: 300,
                    useNativeDriver: false
                })
            ]).start(startIndicatorAnimation);
        }
    }


    useEffect(() => {
        startIndicatorAnimation()
    }, []);


    useEffect(() => {

        if (displayedActionFeedback) {
            setTimeout(() => {
                onFinishFeedback(item, displayedActionFeedback);
            }, 500);
            Animated.timing(
                fadeAnim, {toValue: 1, duration: 100, useNativeDriver: true,}
            ).start();
        }

    }, [displayedActionFeedback])


    const getMessageText = () => {

        const isThisSender = chatProfile.userId === item.lastMessageSender;

        if (item.lastMessage === 'image' && isThisSender) {
            return I19n.t('لقد قمت بإرسال صورة')
        } else if (item.lastMessage === 'image') {
            return I19n.t('قام بإرسال صورة')
        } else {
            return `${isThisSender? (I19n.t('أنت:') + ' ') : ''}${item?.lastMessage}`;
        }
    }

    const onLongPress = () => {
        ImagePreviewModalService.setVisible({
            show: true,
            asRectangle: true,
            imageUrl: item?.otherUser?.avatar
        });
    };

    const onPressOut = () => {
        ImagePreviewModalService.setVisible({
            show: false
        });
    }

    return (
        <TouchableOpacity activeOpacity={1}
                          onPress={onPress}
                          onLongPress={onLongPress}
                          onPressOut={onPressOut}
                          style={style.container}>
            <ShopImage style={style.senderImage} image={item?.otherUser?.avatar}/>
            <View style={style.textContainer}>
                <View style={style.senderNameContainer}>
                    <DzText style={style.senderName} numberOfLines={1}>
                        {item?.otherUser?.name}
                    </DzText>
                    <DzText style={style.messageTime}>
                        {getTimeSince(item.lastMessageTime)}
                    </DzText>
                </View>
                <View style={style.messageTextAndUnreadCountContainer}>
                    <DzText style={[style.lastMessageText, unreadCount > 0 && style.lastMessageTextUnread]} numberOfLines={1}>
                        {getMessageText()}
                    </DzText>
                    {
                        unreadCount > 0 &&
                        <View style={style.unreadCountContainer}>
                            <DzText style={style.unreadCount}>
                                {unreadCount}
                            </DzText>
                        </View>
                    }
                </View>
            </View>
            {
                !!config &&
                <Animated.View
                    style={[style.deleteActionFeedback, {opacity: fadeAnim}, {backgroundColor: config.backgroundColor}]}>
                    <config.icon width={24} height={24} stroke={'white'}/>
                    <DzText style={style.feedbackText}>
                        {config.text}
                    </DzText>
                </Animated.View>
            }
            {
                displaySwipeIndicator &&
                <Animated.View style={[style.swipeIndicator, {width: indicatorAnim}]}/>
            }

        </TouchableOpacity>
    )
})

export default ConversationsListItem;
