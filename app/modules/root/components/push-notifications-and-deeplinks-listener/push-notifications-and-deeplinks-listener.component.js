import React, {useState} from 'react';
import {useEffect} from "react";
import {Platform} from 'react-native';
import OneSignal from "react-native-onesignal";
import PushNotificationIcon from 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'
import Toast from "deelzat/toast";
import messaging from "@react-native-firebase/messaging";
import {getParameterByName} from "modules/main/others/main-utils";
import DeepLinkingService from "modules/root/others/deeplinking.service";
import {useDispatch, useSelector} from "react-redux";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {chatSelectors, chatThunks} from "modules/chat/stores/chat/chat.store";
import { appActions, appSelectors } from 'modules/main/stores/app/app.store';
import I19n from 'dz-I19n'
import branch from 'react-native-branch'
import {
    getDeeplinkValueFrom,
    parseDeeplinkType,
} from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import DeeplinkTypeConst from 'modules/root/constants/deeplink-type.const';
import CouponInAppMessageModalService
    from 'v2modules/shared/modals/coupon-inapp-message/coupon-inapp-message.modal.service';
import { setInAppPopupToShowOnLaunch } from 'modules/main/others/app.localstore';

let inAppMessageTitle;
const PushNotificationsAndDeepLinksListener = (props) => {

    const dispatch = useDispatch();
    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const isChatScreenVisible = useSelector(chatSelectors.isChatScreenVisibleSelector);
    const chatProfile = useSelector(chatSelectors.chatProfileSelector);
    const [linkInfo, linkInfoSet] = useState();
    const [previousLinkInfo, previousLinkInfoSet] = useState();

    const handlePushNotificationLink = (remoteMessage) => {
        if (remoteMessage?.data) {
            const type = parseDeeplinkType(remoteMessage.data.type);
            const id = getDeeplinkValueFrom(type, remoteMessage.data);
            const title = remoteMessage.notification?.title
            const trackSource = {name: EVENT_SOURCE.PUSH_NOTIFICATION, attr1: title, attr2: 'firebase'}
            if (!!type && (!previousLinkInfo || (previousLinkInfo?.type !== type && (previousLinkInfo?.time - Date.now() > 5000)))) {
                linkInfoSet({type, id, trackSource})
            }
        }
    };

    const handleDeepLink = async (data, trackSource, extra) => {
        let type, id;
        if (data) {
            type = getParameterByName('type', data.url || data.link) || data.type;
            type = parseDeeplinkType(type);

            id = getParameterByName('id', data.url || data.link) ||  getDeeplinkValueFrom(type, data) || data.id;
            if (!!type)
                linkInfoSet({type, id, trackSource, extra})
        }
    };

    const handleChatUnreadMessages = (remoteMessage) => {

        const messageType = parseDeeplinkType(remoteMessage.data?.type);

        if (messageType === DeeplinkTypeConst.CHAT_ROOM) {

            const userId = getDeeplinkValueFrom(DeeplinkTypeConst.CHAT_ROOM, remoteMessage.data);
            dispatch(chatThunks.addUnreadMessageForUser(userId));
        }
    }

    useEffect(() => {
        const msgType = parseDeeplinkType(linkInfo?.type);
        if ((appInitialized && linkInfo) // base requirement
            && (msgType !== DeeplinkTypeConst.CHAT_ROOM || (msgType === DeeplinkTypeConst.CHAT_ROOM && !!chatProfile))) {
            //GlobalSpinnerService.setVisible(true);
            DeepLinkingService.navigateToLink(linkInfo);
            linkInfoSet();
            previousLinkInfoSet({...linkInfo, time: Date.now()});

        }
    }, [appInitialized, linkInfo, chatProfile]);

    useEffect(() => {
        OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
            console.log("OneSignal: notification will show in foreground:", notifReceivedEvent);
            let notification = notifReceivedEvent.getNotification();
            if (notification) {
                const title = notification.title;
                const body = notification.body;
                const image = notification.bigPicture || PushNotificationIcon;
                const trackSource = {name: EVENT_SOURCE.PUSH_NOTIFICATION, attr1: title, attr2: 'onesignal'}
                Toast.pushNotification(title + "\n" + body,
                    5000,
                    image,
                    () => handleDeepLink(notification.additionalData, trackSource)
                );
            }
        });
        OneSignal.setNotificationOpenedHandler(openedEvent => {
            console.log("OneSignal: notification opened:", openedEvent);
            const trackSource = {name: EVENT_SOURCE.PUSH_NOTIFICATION, attr1: openedEvent?.notification?.title, attr2: 'onesignal'}
            handleDeepLink(openedEvent?.notification?.additionalData, trackSource)
        });
        OneSignal.setInAppMessageClickHandler(event => {
            console.log("OneSignal IAM clicked:", event);
            if (event?.click_name) {
                const trackSource = {name: EVENT_SOURCE.IN_APP_MESSAGE, attr1: inAppMessageTitle, attr2: 'onesignal'}
                handleDeepLink({link: event.click_name}, trackSource);
            }
        });


        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log("Firebase: notification app killed: " + Platform.OS + " getInitialNotification", remoteMessage);
                    handleChatUnreadMessages(remoteMessage);
                    handlePushNotificationLink(remoteMessage);

                    const type = parseDeeplinkType(remoteMessage.data?.type);
                    if (type === DeeplinkTypeConst.FREE_COUPON) {

                        dispatch(appActions.SeInAppPopup({
                            type: DeeplinkTypeConst.FREE_COUPON,
                            data: remoteMessage?.data.coupon_code
                        }));

                        if (Platform.OS === 'android') {
                            setInAppPopupToShowOnLaunch({
                                type: DeeplinkTypeConst.FREE_COUPON,
                                data: remoteMessage?.data.coupon_code
                            });
                        }
                    }
                }
            });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("Firebase: notification in background: " + Platform.OS + " setBackgroundMessageHandler", remoteMessage);

            const type = parseDeeplinkType(remoteMessage?.data?.type);
            if (remoteMessage && (Platform.OS === 'android' || type === DeeplinkTypeConst.FREE_COUPON)) {
                handleChatUnreadMessages(remoteMessage);
                handlePushNotificationLink(remoteMessage);

                if (type === DeeplinkTypeConst.FREE_COUPON) {

                    dispatch(appActions.SeInAppPopup({
                        type: DeeplinkTypeConst.FREE_COUPON,
                        data: remoteMessage?.data.coupon_code
                    }));
                }
            }
        });


        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log("Firebase: onNotificationOpenedApp: " + Platform.OS + " getInitialNotification", remoteMessage);

            const type = parseDeeplinkType(remoteMessage?.data?.type);
            if (remoteMessage && (Platform.OS === 'ios' || type === DeeplinkTypeConst.FREE_COUPON)) {
                handleChatUnreadMessages(remoteMessage);
                handlePushNotificationLink(remoteMessage);

                if (type === DeeplinkTypeConst.FREE_COUPON) {

                    dispatch(appActions.SeInAppPopup({
                        type: DeeplinkTypeConst.FREE_COUPON,
                        data: remoteMessage?.data.coupon_code
                    }));
                }
            }
        });

        const unsubscribeForegroundNotifications = messaging().onMessage(async remoteMessage => {
            const title = remoteMessage.notification?.title;
            let body = remoteMessage.notification?.body;
            body = body === 'image'? I19n.t('تم إرسال صورة'): body;
            const image = remoteMessage.notification?.android?.imageUrl || remoteMessage.data?.fcm_options?.image || remoteMessage.notification?.image;

            if (title) {

                console.log("Firebase: notification app foreground: " + Platform.OS, remoteMessage)

                const isChat = parseDeeplinkType(remoteMessage.data?.type) === DeeplinkTypeConst.CHAT_ROOM;
                const isFreeCoupon  = parseDeeplinkType(remoteMessage.data?.type) === DeeplinkTypeConst.FREE_COUPON;

                if (isFreeCoupon) {

                    CouponInAppMessageModalService.setVisible({
                        show: true,
                        title: title,
                        couponCode: remoteMessage.data?.coupon_code,
                    });
                }
                // Display toast in all cases except if it's a message and chat room is visible
                else if (!isChat || !isChatScreenVisible) {

                    const chatTitle = I19n.t('رسالة من') + ":" +"  " + title;
                    Toast.pushNotification((isChat? chatTitle : title) + "\n" + body,
                        isChat? 2000 : 5000,
                        image,
                        () => handlePushNotificationLink(remoteMessage));

                    if (isChat && !isChatScreenVisible) {

                        // if message type is message and it's not opening chatRoom, store in unread message
                        handleChatUnreadMessages(remoteMessage);
                    }
                }

            } else if(remoteMessage.data?.title) {
                console.log("OneSignal IAM show:", remoteMessage);
                inAppMessageTitle = remoteMessage.data.title
            }
        });


        branch.subscribe(({error, params, uri}) => {

            if (error || !params) {
                if (error) {
                    console.error('Error from Branch: ' + error)
                }
                return;
            }

            const link = params['$canonical_url'];
            if (link) {
                const trackSource = {name: EVENT_SOURCE.DEEPLINK, attr1: inAppMessageTitle, attr2: 'onesignal'}
                handleDeepLink({link}, trackSource, {image: params['$og_image_url']});
            }
        })

        return () => {
            unsubscribeForegroundNotifications();
        }
    }, [isChatScreenVisible])


    return <></>
}
export default PushNotificationsAndDeepLinksListener
