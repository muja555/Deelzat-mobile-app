import React, { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import {useSelector} from "react-redux";
import {authSelectors} from "modules/auth/stores/auth/auth.store";

import {appSelectors} from "modules/main/stores/app/app.store";
import {setUserProperty} from "modules/analytics/others/analytics.utils";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import ChatProfileUser from "modules/chat/components/sync-chat-profile/sync-chat-profile.component";
import jwt_decode from "jwt-decode";
import {NativeModules, Platform} from "react-native";
import DeviceInfo from "react-native-device-info";
import DeviceUpdateInput from "modules/main/inputs/device-update.input";
import DeviceApi from "modules/main/apis/device.api";
import SyncUserSavedItems
    from "v2modules/root/components/sync-user-saved-items/sync-user-saved-items.component";
import {isRTL} from "dz-I19n";
import { isTestBuild } from 'modules/main/others/main-utils';

const SyncDeviceInfo = () => {

    const authState = useSelector(authSelectors.authStateSelector);
    const appInitialized = useSelector(appSelectors.appInitializedSelector);

    const [token, setToken] = useState(null);
    const [latestUserId, latestUserIdSet] = useState();

    const requestUserPermission = () => {
        (async function() {
            try {
                const settings = await messaging().requestPermission();
                const fcmToken = await messaging().getToken();
                if (fcmToken) {
                    setToken(fcmToken)
                }
            }
            catch (e) {
                console.warn(e)
            }
        })();
    };

    const updateDeviceInfo = (isLoggedIn, userIdToSend) => {

        const deviceLanguage =
            Platform.OS.toString().toUpperCase() === 'IOS'
                ? NativeModules.SettingsManager.settings.AppleLocale ||
                NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
                : NativeModules.I18nManager.localeIdentifier;

        (async () => {
            try {

                const inputs = new DeviceUpdateInput();

                inputs.device_id = DeviceInfo.getUniqueId();
                inputs.token = await messaging().getToken();
                inputs.locale = deviceLanguage;
                inputs.os = Platform.OS.toString().toUpperCase();
                inputs.app_version = DeviceInfo.getVersion();
                inputs.app_build = DeviceInfo.getBuildNumber();
                inputs.app_version_build = DeviceInfo.getReadableVersion();
                inputs.brand = DeviceInfo.getBrand();
                inputs.os_version = DeviceInfo.getSystemVersion();
                inputs.logged_in = isLoggedIn
                inputs.user_id = userIdToSend

                await DeviceApi.update(inputs);
                setUserProperty(USER_PROP.IS_LOGGED_IN, isLoggedIn);
            }
            catch (e) {
                console.warn(JSON.stringify(e))
            }
        })();

    }

    useEffect(() => {

        if (!appInitialized) {
            return;
        }

        if (!token) {
            setTimeout(requestUserPermission, 3000)
        }
    },[token, appInitialized]);

    useEffect(() => {

        if (!token || !authState?.checked) {
            return;
        }

        let userId;
        try {
            userId = jwt_decode(authState.auth0.idToken).sub;
            latestUserIdSet(userId);
        } catch (e) {
        }

        if (authState?.isAuthenticated && userId) {
            updateDeviceInfo(true, userId);
        }
        else if (!authState?.isAuthenticated) {
            updateDeviceInfo(false, latestUserId);
        }

    }, [token, authState?.checked, authState?.isAuthenticated])

    useEffect(() => {
        analytics().setAnalyticsCollectionEnabled(!__DEV__)
            .then(() => {
                setUserProperty(USER_PROP.IS_RTL, isRTL())
                setUserProperty(USER_PROP.IS_TEST, isTestBuild() || __DEV__)
            }).catch(console.warn)
        crashlytics().setCrashlyticsCollectionEnabled(!__DEV__)
    },[]);

    if (appInitialized) {
        return (
            <>
                <ChatProfileUser token={token}/>
                <SyncUserSavedItems />
            </>
        )
    }

    return (
        <></>
    );
};

export default SyncDeviceInfo;
