/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from "v2modules/main/navigators/main-stack/main-stack.navigator";
import StoreProvider from "modules/root/components/store-provider/store-provider.component";
import AppInitialize from "v2modules/root/components/app-initialize/app-initialize.component";
import GlobalComponents from "modules/root/components/global-components/global-components.component";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {getLanguageLocale} from "dz-I19n/locales.storage";
import {AppState, I18nManager} from "react-native";
import RNRestart from "react-native-restart";
import I19n, { initLocale } from 'dz-I19n';
import AuthRequiredModal from "modules/auth/modals/auth-required/auth-required.modal";
import FillChatNameModal from "modules/chat/modals/fill-chat-name/fill-chat-name.modal";
import NetworkStatus from "v2modules/root/components/network-status/network-status.component";
import WillShowToast from "deelzat/toast/will-show-toast";
import MemoryWatcher from "v2modules/root/components/memory-watcher/memory-watcher.component";
import RootService from "./root.service";
import {navigationRef} from "v2modules/root/utils/root-navigation.helper";

const Root: () => React$Node = () => {

    const [localeChecked, localeCheckedSet] = useState(false);

    useEffect(() => {

        (async () => {
            const locale = await getLanguageLocale();
            if (locale === 'ar') {
                if (!I18nManager.isRTL) {
                    I18nManager.allowRTL(true);
                    I18nManager.forceRTL(true);
                    RNRestart.Restart();
                }
            }
            else if (locale === 'en') {
                if (I18nManager.isRTL) {
                    I18nManager.allowRTL(false);
                    I18nManager.forceRTL(false);
                    RNRestart.Restart();
                }
            }
            initLocale((locale === 'en' || locale === 'ar')? locale: 'en')
                .finally(() =>  localeCheckedSet(true));
        })();

        return RootService.onReset(() => {
            localeCheckedSet(false);
        })

    }, []);

    if (!localeChecked)
        return (
            <></>
        );

    return (
        <StoreProvider>
            <MemoryWatcher />
            <AppInitialize/>
            <GlobalComponents/>
            <SafeAreaProvider>
                <WillShowToast id={'main-toast'} />
                <NavigationContainer ref={navigationRef}>
                    <MainStackNavigator/>
                </NavigationContainer>
                <NetworkStatus />
                <AuthRequiredModal/>
                <FillChatNameModal />
            </SafeAreaProvider>
        </StoreProvider>
    );
};

export default Root;
