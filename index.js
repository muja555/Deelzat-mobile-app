/**
 * @format
 */
import './wdyr';
import {AppRegistry, Platform} from 'react-native';
import Root from 'v2modules/root/components/root/root.component';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import {updateChatUnreadMessagesForUser} from "modules/chat/others/chat.localstore";
import store from "modules/root/components/store-provider/store-provider";
import {chatActions} from "./app/modules/chat/stores/chat/chat.store";
import DeeplinkTypeConst from 'modules/root/constants/deeplink-type.const';
import {
    getDeeplinkValueFrom,
    parseDeeplinkType,
} from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import { setInAppPopupToShowOnLaunch } from 'modules/main/others/app.localstore';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("index.js Firebase: notification background: " + Platform.OS, remoteMessage);

    const type = parseDeeplinkType(remoteMessage.data?.type);
    const data = getDeeplinkValueFrom(type, remoteMessage.data);
    if (type === DeeplinkTypeConst.CHAT_ROOM) {

        if (data) {
            const unreadMap = await updateChatUnreadMessagesForUser(data);
            store.dispatch(chatActions.SetUnreadMessages(unreadMap));
        }
    }
    else if (type === DeeplinkTypeConst.FREE_COUPON) {

        setInAppPopupToShowOnLaunch({
            type: DeeplinkTypeConst.FREE_COUPON,
            data: remoteMessage.data?.coupon_code,
            route_to_page: remoteMessage.data?.route_to_page
        });
    }
});


AppRegistry.registerComponent(appName, () => Root);

