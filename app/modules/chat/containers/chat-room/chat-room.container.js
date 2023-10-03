import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {chatRoomContainerStyle as style} from './chat-room.container.style'
import {SafeAreaView, Text, View, TouchableOpacity, Image, Platform} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {chatSelectors, chatThunks} from "modules/chat/stores/chat/chat.store";
import firestore from '@react-native-firebase/firestore';
import ChatRoom from "modules/chat/components/chat-room/chat-room.component";
import {GiftedChat} from "@deelzat/react-native-gifted-chat";
import {chatActions} from 'modules/chat/stores/chat/chat.store'
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import {useIsFocused} from "@react-navigation/native";
import {
    generateChatProfile,
    getChatProfileFromFirestore,
    getRoomName,
    updateChatProfileOnFirestore,
} from 'modules/chat/others/chat.utils';
import ChatApi from "modules/chat/apis/chat.api";
import {routeToShop} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {trackOpenConversation} from "modules/analytics/others/analytics.utils";
import I19n from 'dz-I19n';
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {LayoutStyle, LocalizedLayout} from "deelzat/style";
import {ButtonOptions} from "deelzat/ui";
import BackSvg from "assets/icons/BackIcon.svg";
import IconButton from "deelzat/v2-ui/icon-button";
import {choseFromImageLibrary} from "modules/main/others/images.utils";
import uniqueId from "lodash/uniqueId";
import {DzText} from "deelzat/v2-ui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import WillShowToast from "deelzat/toast/will-show-toast";
import ChatSendMessageInput from "modules/chat/inputs/chat-send-message.input";
import MessageStatusConst from "modules/chat/constants/message-status.const";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const PAGE_SIZE = 9;
const ChatRoomContainer = (props) => {

    const {
        toUserId,
        shop,
        draftImageUrl,
    } = props.route.params;

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const latestDoctRef = useRef();
    const conversationsQuery = useRef();
    const [fetchMore, fetchMoreSet] = useState(true);
    const [currentPage, currentPageSet] = useState(1);

    const supportAccount = useSelector(chatSelectors.supportAccountSelector);
    const chatProfile = useSelector(chatSelectors.chatProfileSelector);
    const chatImages = useSelector(chatSelectors.chatImagesSelector);

    const [latestSentStatus, latestSentStatusSet] = useState();
    const [isLoadingMessages, isLoadingMessagesSet] = useState(true);
    const [messages, messagesSet] = useState([]);
    const messagesRef = useRef([]);
    const [otherUser, otherUserSet] = useState();

    const trackSource = {name: EVENT_SOURCE.CHAT_ROOM, attr1: otherUser?.userId, attr2: otherUser?.shopId};

    const isOtherIsSupport = !!toUserId && toUserId === supportAccount?.userId;
    const isSupportConversation = chatProfile.isSupportAccount || isOtherIsSupport;
    const roomName = getRoomName(toUserId, chatProfile?.userId);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {

        dispatch(chatActions.SetIsChatRoomVisible(isFocused));

        if (isFocused){
            dispatch(chatThunks.addUnreadMessageForUser(toUserId, 0));
        }

    }, [isFocused]);


    const prepareDocMessage = (docSnap) => {

        const data = docSnap.data();
        const messageBubbleKey = Math.random().toString(36).substring(7);
        if (data.createdAt) {
            return {
                ...data,
                createdAt: docSnap.data().createdAt.toDate(),
                position: 'left',
                _id: data._id || messageBubbleKey,
            }
        } else {
            return {
                ...data,
                createdAt: new Date(),
                _id: data._id || messageBubbleKey,
            }
        }
    }


    const updateSeenStatusForMessage = (message) => {
        if (message
            && message.sentBy === toUserId
            && !message.seenBy) {

            firestore().collection('chat_rooms')
                .doc(roomName)
                .collection('messages')
                .where("createdAt", "==", message.createdAt)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        doc.ref.update({seenBy: chatProfile.userId})
                    });
                })
                .catch(console.warn);

    }
}

    useEffect(() => {
        if (!otherUser)
            return;


        const onSnapshot = (querySnap) => {
            latestDoctRef.current = querySnap.docs[querySnap.docs.length - 1];
            const _messages = querySnap.docs.map(docSnap => {
                isLoadingMessagesSet(false);
                return prepareDocMessage(docSnap);
            });

            // Mark last message as seen if it's from other person
            const latestMsg = _messages.length > 0 && _messages[0];
            updateSeenStatusForMessage(latestMsg);

            // latestSentStatusSet
            if (latestMsg && !latestMsg.seenBy
                && latestMsg.sentBy === chatProfile?.userId) {

                latestSentStatusSet({
                    status: MessageStatusConst.SENT,
                });
            }

            messagesSet(old => [...old, ..._messages]);
        }



        if (!conversationsQuery.current) {

            conversationsQuery.current = firestore().collection('chat_rooms')
                .doc(roomName)
                .collection('messages')
                .orderBy('createdAt', "desc")
                .limit(PAGE_SIZE);
        }


        // fetch chat list
        if (latestDoctRef.current) {
            conversationsQuery.current
                .startAfter(latestDoctRef.current)
                .get()
                .then(docData => {
                    if (docData.docs.length) {
                        onSnapshot(docData);
                    }
                    else {
                        fetchMoreSet(false);
                    }
                });
        }
        else {
            conversationsQuery.current
                .get()
                .then(docData => {
                    if (docData.docs.length) {
                        onSnapshot(docData);
                    }
                });
        }

    }, [otherUser, currentPage, chatProfile, roomName]);


    useEffect(() => {


        const updateListChanges = (newLatestConv, remove = false) => {

            const currIndex = messagesRef.current.findIndex(conv => conv.createdAt === newLatestConv.createdAt || conv._id === newLatestConv._id);

            if (currIndex === -1) { // Add

                messagesSet(oldConvs => [newLatestConv, ...oldConvs]);
                updateSeenStatusForMessage(newLatestConv);
            }
            else { // Update

                const _temp = [...messagesRef.current];
                _temp.splice(currIndex, 1);
                if (!remove) {
                    _temp.unshift(newLatestConv);
                }
                messagesSet(_temp);
            }
        }


        const latestConRef = firestore().collection('chat_rooms')
            .doc(roomName)
            .collection('messages')
            .orderBy('createdAt', "desc")
            .limit(1);

        return latestConRef.onSnapshot(querySnap => {

            const changes = querySnap.docChanges();

            if (changes.length > 0) {

                const latestChange = changes[changes.length - 1]
                const latestConv = prepareDocMessage(latestChange.doc);

                if (latestChange.type === "added"
                    && (messagesRef.current.length
                        && (latestConv.text !== messagesRef.current[0].text
                            || latestConv.image !== messagesRef.current[0].image
                            || latestConv.images !== messagesRef.current[0].images
                            || latestConv.sentBy !== messagesRef.current[0].sentBy
                        ))) {
                    updateListChanges(latestConv);
                } else if (latestChange?.type === "modified") {
                    updateListChanges(latestConv);
                } else if (latestChange?.type === "removed") {
                    updateListChanges(latestConv, true);
                }
            }
        });

    }, []);


    useEffect(() => {

        // Add draft image to images to be sent
        if (draftImageUrl) {
            dispatch(chatActions.SetChatImages([{
                id: 'DRAFT_IMAGE',
                uri: draftImageUrl,
                downloadURL: draftImageUrl
            }]));
        }

        // Fetch other person profile
        // If not exists: create one for it
        getChatProfileFromFirestore(toUserId)
            .then(profile => {
                if (profile) {
                    otherUserSet(profile)
                } else {
                    updateChatProfileOnFirestore(generateChatProfile(shop, {userId: toUserId}))
                        .then(() => getChatProfileFromFirestore(toUserId))
                        .then(otherUserSet)
                }
            })
        setTimeout(() => isLoadingMessagesSet(false), 1000)

        return () => dispatch(chatActions.CleanChatImages())
    }, [])

    const onRemoveImage = useCallback((image) => {
        dispatch(chatThunks.removeImageToSend(image))
    }, []);


    const onPressInfo = useCallback(() =>
        routeToShop({id: otherUser?.shopId}, undefined, trackSource), [otherUser?.shopId]);


    const addImagesToMessage = (images, message) => {
        if (!images.length)
            return;

        message.image = images[0].downloadURL;
        if (images.length > 1) {
            message.images = images.map(img => img.downloadURL).join(',');
        }

        dispatch(chatActions.CleanChatImages())
    }


    const onSend = (_messages) => {

        const toSend = {
            ..._messages[0],
            sentBy: chatProfile.userId,
            sentTo: toUserId,
            createdAt: new Date(),
        }

        latestSentStatusSet({
            id: toSend?._id,
        });

        addImagesToMessage(chatImages, toSend);

        messagesSet(previousMessages => GiftedChat.append(previousMessages, toSend))

        const inputs = new ChatSendMessageInput();
        inputs.other_user = otherUser;
        inputs.sender_user = chatProfile;
        inputs.room_name = roomName;
        inputs.message = toSend;
        inputs.is_support_conv = isSupportConversation;

        ChatApi.sendMessage(inputs)
            .then(() => {
                latestSentStatusSet({
                    id: toSend?._id,
                    status: MessageStatusConst.SENT
                });
            })
            .catch((e) => {
                latestSentStatusSet({
                    id: toSend?._id,
                    status: MessageStatusConst.ERROR
                });
                console.warn(e);
            });
    }

    const onPressContactSupport = () => {
        if (supportAccount?.userId) {
            RootNavigation.push(MainStackNavsConst.CHAT_ROOM, {toUserId: supportAccount?.userId});
            trackOpenConversation(supportAccount?.userId, {name: EVENT_SOURCE.CHAT_ROOM})
        }
    }


    const onPressCamera = useCallback(() => {
        RootNavigation.navigate(MainStackNavsConst.CHAT_IMAGES_PICKER, {roomName})
    }, [roomName]);


    const onPressGallery = useCallback(() => {
        choseFromImageLibrary(true, 0.7).then(results => {
            const addedImages = results.map(image =>
                ({
                    id: uniqueId(['']),
                    uri: image.path || image.uri,
                    imageSource: 'GALLERY'
                })
            );

            dispatch(chatThunks.uploadImagesForSend(roomName, addedImages))
        }).catch(console.warn);
    }, [roomName]);


    const chatProfileMem = useMemo(() => {
        return ({
                ...chatProfile,
                _id: chatProfile.userId
            })
    },[chatProfile]);


    const onEndReached = useCallback(() => {
        if (fetchMore) {
            currentPageSet(old => old + 1);
        }
    }, [fetchMore]);


    return (
        <View style={[style.container, {paddingTop: insets.top}]}>
            <WillShowToast id={'chat-room'}/>
            <View style={style.header}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={'#fff'} width={24} height={24}/>
                </IconButton>
                <TouchableOpacity activeOpacity={0.8}
                                  disabled={isOtherIsSupport || !otherUser?.shopId}
                                  onPress={onPressInfo}
                                  style={style.avatarButton}>
                    <ShopImage image={isOtherIsSupport ? supportAccount?.avatar : otherUser?.avatar}
                               style={style.otherUserImage}/>
                    <DzText style={style.otherUserName} numberOfLines={2}>
                        {isOtherIsSupport ? supportAccount?.name : otherUser?.name || ' '}
                    </DzText>
                </TouchableOpacity>
            </View>
            <View style={LayoutStyle.Flex}>
            <Image source={require('assets/images/ShadowTopLine.png')} style={style.shadowView}/>
            <View style={style.component}>
                {
                    (!isLoadingMessages && !messages?.length) &&
                    <View style={style.yellowNote}>
                        <DzText style={style.yellowNoteText}>
                            <DzText style={style.yellowNoteText}>
                                {I19n.t('من أجل خصوصيتك، ننصحك بالإحتفاظ بجميع المحادثات داخل تطبيق ديلزات.')}{'\n'}
                            </DzText>
                            {
                                !isOtherIsSupport &&
                                <>
                                    <DzText style={style.yellowNoteText}>
                                        {I19n.t('في حال واجهتك أي مشكلة، فيرجى إبلاغ')}{' '}
                                    </DzText>
                                    <DzText style={[style.yellowNoteText, style.supportLink]}
                                          onPress={onPressContactSupport}>
                                        {I19n.t('فريق ديلزات للدعم الفني هنا.')}{'\n'}
                                    </DzText>
                                    <DzText style={style.yellowNoteText}>
                                        {I19n.t('فريقنا متواجد على مدار الساعة لخدمتكم')}
                                    </DzText>
                                </>
                            }
                        </DzText>
                    </View>
                }
                <ChatRoom
                    messages={messages}
                    isLoadingMessages={isLoadingMessages}
                    onSend={onSend}
                    onRemoveImage={onRemoveImage}
                    onPressCamera={onPressCamera}
                    onPressGallery={onPressGallery}
                    images={chatImages}
                    fetchMore={fetchMore}
                    onEndReached={onEndReached}
                    chatProfile={chatProfileMem}
                    latestSentStatus={latestSentStatus}/>
            </View>
            </View>
        </View>
    )
}

export default ChatRoomContainer
