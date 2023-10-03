import React, {useEffect, useRef, useState} from 'react';

import RNSplashScreen from "react-native-lottie-splash-screen";
import {authThunks, authSelectors} from "modules/auth/stores/auth/auth.store";
import {useDispatch, useSelector} from "react-redux";
import {Platform} from "react-native";
import perf from '@react-native-firebase/perf';

import * as Sentry from '@sentry/react-native';
import Keys from "environments/keys";
import {appSelectors} from "modules/main/stores/app/app.store";
import RemoteConfigs, {remoteConfig} from "modules/root/components/remote-configs/remote-configs.component";
import {chatThunks} from 'modules/chat/stores/chat/chat.store';
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import * as Actions from "modules/main/stores/app/app.actions";
import OneSignal from "react-native-onesignal";
import {persistentDataThunks} from "modules/main/stores/persistent-data/persistent-data.store";
import StripeInitialize from "modules/root/components/stripe-initialize/stripe-initialize.component";
import SyncDeviceInfo from "modules/root/components/sync-device-info/sync-device-info.component";
import { Settings } from 'react-native-fbsdk-next';
import {isOnBoardingCompleted} from "modules/main/others/app.localstore";
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";
import OnBoardingService from "v2modules/page/containers/onboarding/onboarding.container.service";
import PushNotificationsAndDeepLinksListener
    from "modules/root/components/push-notifications-and-deeplinks-listener/push-notifications-and-deeplinks-listener.component";
// import Smartlook from "smartlook-react-native-wrapper";
import GeoInitialize from "v2modules/geo/components/geo-initialize/geo-initialize.component";
import {geoActions} from "v2modules/geo/stores/geo/geo.store";
import * as blockedShopThunks from 'v2modules/shop/stores/blocked-shops/blocked-shops.thunks';

const AppInitialize = () => {

    const dispatch = useDispatch();
    const authState = useSelector(authSelectors.authStateSelector);
    const isRemoteConfigsReady = useSelector(appSelectors.isRemoteConfigsReadySelector);
    const categoriesLoaded = useSelector(persistentDataSelectors.persistentDataWasLoadedSelector);
    const [isOnBoardingReady, isOnBoardingReadySet] = useState(false);
    const firebaseRef = useRef();
    const startTime = useRef();

    useEffect(() => {

        if (!__DEV__) {

            // Setup firebase perf monitoring
            (async () => {
                startTime.current = Date.now();
                firebaseRef.current = await perf().startTrace('app-initialization');
            })();

            // Init Sentry
            Sentry.init({
                dsn: Keys.Sentry.dsn,
                enableAutoSessionTracking: true,
                sessionTrackingIntervalMillis: 120000,
            });

            // Init Smartlook
            //Smartlook.setupAndStartRecording(Keys.Smartlook.apiKey);

            // Init Facebook
            Settings.initializeSDK();
        }

        // init OneSignal
        OneSignal.setAppId(Keys.OneSignal.appId);
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        if (Platform.OS === 'ios') {
            OneSignal.promptForPushNotificationsWithUserResponse(response => {
                console.log("Prompt response:", response);
            });
        }

        dispatch(persistentDataThunks.loadPersistentData());
        dispatch(chatThunks.loadUnreadMessages());
        dispatch(chatThunks.initializeShouldDisplaySwipeIndicator());
        dispatch(persistentDataThunks.loadAddons());
        dispatch(blockedShopThunks.loadBlockedShops());

    }, []);

    useEffect(() => {
        if (isRemoteConfigsReady) {
            dispatch(authThunks.checkAuth());
            isOnBoardingCompleted().then((isCompleted) => {
                if (isCompleted) {
                    isOnBoardingReadySet(true);
                    dispatch(geoActions.SetAllowToShowSwitchMarket(true));
                } else {
                    try {
                        const pages = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.OnBoardingPages)?.asString());
                        OnBoardingService.showOnBoarding({pages});
                        isOnBoardingReadySet(true);
                    } catch (e) {
                        console.warn(e);
                        isOnBoardingReadySet(true);
                    }
                }
            })
        }
    }, [isRemoteConfigsReady])

    RNSplashScreen.hide();

    useEffect(() => {
        if (authState.checked
            && isOnBoardingReady
            && categoriesLoaded
        ) {

            // Track firebase measurement
            if (!__DEV__ && firebaseRef.current) {
                const initializeTime = Date.now() - startTime.current;
                firebaseRef.current.putMetric('initializeTime', initializeTime);
                firebaseRef.current.stop();
            }

            dispatch(Actions.SetAppInitialized(true));
            RNSplashScreen.hide();
        }
    }, [authState.checked, isOnBoardingReady, categoriesLoaded]);

    return (
        <>
            <GeoInitialize />
            <SyncDeviceInfo />
            <RemoteConfigs />
            <StripeInitialize />
            <PushNotificationsAndDeepLinksListener/>
        </>
    )
};

export default AppInitialize;
